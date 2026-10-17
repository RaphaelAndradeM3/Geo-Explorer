import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { trackService } from '../services/trackService.js';
import { challengeService } from '../services/challengeService.js';
import { certificateService } from '../services/certificateService.js';
import { DifficultyLevel } from '../types/index.js';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'geo-explorer-mcp',
    version: '1.0.0'
  });

  // 1. Tool: list_tracks
  server.tool(
    'list_tracks',
    'Lista as trilhas de aprendizagem disponíveis no Geo-Explorer com opções de filtro por tecnologia, nível ou categoria.',
    {
      technology: z.string().optional().describe('Filtrar por tecnologia (ex: python, javascript, devops, gis, c#)'),
      level: z.enum(['iniciante', 'intermediario', 'avancado']).optional().describe('Nível da trilha'),
      category: z.string().optional().describe('Categoria da trilha (ex: Data Science, Web, Cloud)')
    },
    async ({ technology, level, category }) => {
      const tracks = trackService.filterTracks({ technology, level, category });
      const simplified = tracks.map((t) => ({
        id: t.id,
        name: t.name,
        technology: t.technology,
        category: t.category,
        level: t.level,
        estimatedHours: t.estimatedHours,
        modulesCount: t.modules.length,
        challengesCount: t.challenges.length,
        description: t.description
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(simplified, null, 2)
          }
        ]
      };
    }
  );

  // 2. Tool: get_track_details
  server.tool(
    'get_track_details',
    'Retorna todos os detalhes de uma trilha específica, incluindo módulos, tópicos pedagógicos e lista de desafios práticos.',
    {
      trackId: z.string().describe('ID da trilha (ex: python-ai, geo-spatial, javascript-fullstack, cloud-devops, csharp-dotnet)')
    },
    async ({ trackId }) => {
      const track = trackService.findTrackById(trackId);
      if (!track) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Trilha com ID "${trackId}" não encontrada.`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(track, null, 2)
          }
        ]
      };
    }
  );

  // 3. Tool: get_code_challenge
  server.tool(
    'get_code_challenge',
    'Gera ou recupera um desafio prático de código conforme tecnologia, nível de dificuldade ou identificador da trilha.',
    {
      technology: z.string().optional().describe('Tecnologia alvo (ex: python, javascript, devops, gis, c#)'),
      level: z.enum(['iniciante', 'intermediario', 'avancado']).optional().describe('Nível de dificuldade do desafio'),
      trackId: z.string().optional().describe('ID da trilha de origem'),
      challengeId: z.string().optional().describe('ID específico do desafio (ex: ch-py-init)')
    },
    async ({ technology, level, trackId, challengeId }) => {
      const challenge = challengeService.getChallenge({
        technology,
        level,
        trackId,
        id: challengeId
      });

      if (!challenge) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Nenhum desafio encontrado para os critérios fornecidos.`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(challenge, null, 2)
          }
        ]
      };
    }
  );

  // 4. Tool: generate_certificate
  server.tool(
    'generate_certificate',
    'Emite um certificado fictício para um estudante que concluiu uma trilha no Geo-Explorer, gerando código de autenticação e arquivos.',
    {
      studentName: z.string().describe('Nome completo do estudante / explorador'),
      trackId: z.string().describe('ID da trilha concluída (ex: python-ai, geo-spatial, javascript-fullstack)'),
      grade: z.string().optional().describe('Aproveitamento ou nota (ex: Excelente, Destaque com Louvor)'),
      format: z.enum(['html', 'svg', 'json', 'all']).optional().describe('Formatos de exportação de arquivo')
    },
    async ({ studentName, trackId, grade, format }) => {
      try {
        const formats: Array<'html' | 'svg' | 'json'> =
          !format || format === 'all'
            ? ['html', 'svg', 'json']
            : [format];

        const result = certificateService.generateCertificate({
          studentName,
          trackId,
          grade: grade || 'Excelente',
          formats
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: 'Certificado fictício emitido com sucesso pelo Geo-Explorer!',
                  certificate: result.certificate,
                  generatedFiles: result.files
                },
                null,
                2
              )
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Erro ao emitir certificado: ${err.message}`
            }
          ]
        };
      }
    }
  );

  // 5. Tool: verify_certificate
  server.tool(
    'verify_certificate',
    'Verifica a autenticidade de um código ou ID de certificado emitido pela plataforma Geo-Explorer.',
    {
      verificationCode: z.string().describe('Código de verificação (ex: GEO-XXXX-XXXX-XXXX) ou ID do certificado')
    },
    async ({ verificationCode }) => {
      const verification = certificateService.verifyCertificate(verificationCode);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(verification, null, 2)
          }
        ]
      };
    }
  );

  // 6. Resource: tracks list
  server.resource(
    'all_tracks',
    'tracks://list',
    async (uri) => {
      const tracks = trackService.getAllTracks();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(tracks, null, 2),
            mimeType: 'application/json'
          }
        ]
      };
    }
  );

  // 7. Prompt: study_plan_advisor
  server.prompt(
    'study_plan_advisor',
    'Ajuda o assistente a formular um plano de estudos personalizado com base nas metas do explorador.',
    {
      goal: z.string().describe('Objetivo de aprendizagem ou transição de carreira'),
      timePerWeek: z.string().describe('Horas disponíveis por semana')
    },
    async ({ goal, timePerWeek }) => {
      const tracks = trackService.getAllTracks();
      const catalog = tracks.map((t) => `- ${t.name} (${t.technology}, ${t.estimatedHours}h): ${t.description}`).join('\n');

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Você é o Mentor da expedição Geo-Explorer.
O usuário tem a seguinte meta: "${goal}".
Disponibilidade informada: "${timePerWeek}".

Aqui está o catálogo de trilhas disponíveis:
${catalog}

Por favor, recomende a melhor trilha, a ordem dos módulos e uma rotina de estudos semanal para alcançar a meta.`
            }
          }
        ]
      };
    }
  );

  return server;
}

export async function startMcpServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[Geo-Explorer MCP] Servidor iniciado e escutando via Stdio.');
}

// Se executado diretamente
if (process.argv[1] && process.argv[1].endsWith('server.ts') || process.argv[1]?.endsWith('server.js')) {
  startMcpServer().catch((err) => {
    console.error('[Geo-Explorer MCP Error]', err);
    process.exit(1);
  });
}
