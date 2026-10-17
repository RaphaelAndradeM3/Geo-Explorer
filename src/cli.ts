import { Command } from 'commander';
import chalk from 'chalk';
import { trackService } from './services/trackService.js';
import { challengeService } from './services/challengeService.js';
import { certificateService } from './services/certificateService.js';
import {
  formatCertificateTerminal,
  formatChallenge,
  formatTrackDetails,
  formatTrackSummary,
  getBanner
} from './utils/formatting.js';
import { DifficultyLevel } from './types/index.js';

export function createCli(): Command {
  const program = new Command();

  program
    .name('geo-explorer')
    .description('Geo-Explorer: Plataforma de exploração de trilhas de aprendizagem, desafios práticos de código e emissão de certificados.')
    .version('1.0.0');

  // Comando: trilha
  program
    .command('trilha')
    .alias('track')
    .alias('trilhas')
    .description('Consulta trilhas de aprendizagem e planos de estudo')
    .option('-t, --tech <tecnologia>', 'Filtrar por tecnologia (ex: python, javascript, devops, gis, c#)')
    .option('-n, --nivel <nivel>', 'Filtrar por nível (iniciante, intermediario, avancado)')
    .option('-i, --id <id>', 'ID específico da trilha')
    .option('-d, --detalhes', 'Exibir detalhes completos dos módulos e desafios')
    .action((opts) => {
      console.log(getBanner());

      if (opts.id) {
        const track = trackService.findTrackById(opts.id);
        if (!track) {
          console.log(chalk.red(`❌ Trilha com ID "${opts.id}" não foi encontrada.`));
          console.log(chalk.gray('Use "geo-explorer trilha" para listar todas as opções disponíveis.\n'));
          return;
        }
        console.log(formatTrackDetails(track));
        return;
      }

      const results = trackService.filterTracks({
        technology: opts.tech,
        level: opts.nivel as DifficultyLevel
      });

      if (results.length === 0) {
        console.log(chalk.yellow('⚠️  Nenhuma trilha encontrada para os filtros especificados.'));
        console.log(chalk.gray(`Filtros: Tech=${opts.tech || 'Todas'}, Nível=${opts.nivel || 'Todos'}\n`));
        return;
      }

      console.log(chalk.bold.cyan(`📍 Encontrada(s) ${results.length} trilha(s) de aprendizagem:\n`));

      results.forEach((track) => {
        if (opts.detalhes) {
          console.log(formatTrackDetails(track));
        } else {
          console.log(formatTrackSummary(track));
        }
      });

      if (!opts.detalhes) {
        console.log(chalk.dim('💡 Dica: Adicione a flag --detalhes ou -d para ver o syllabus completo dos módulos.\n'));
      }
    });

  // Comando: desafio
  program
    .command('desafio')
    .alias('challenge')
    .alias('desafios')
    .description('Gera um desafio prático de código conforme tecnologia e nível informado')
    .option('-t, --tech <tecnologia>', 'Tecnologia desejada (ex: python, javascript, devops, gis, c#)')
    .option('-n, --nivel <nivel>', 'Nível de dificuldade (iniciante, intermediario, avancado)')
    .option('-i, --id <id>', 'ID específico do desafio (ex: ch-py-init)')
    .option('--trilha <trilhaId>', 'ID da trilha para buscar desafios')
    .option('--com-dicas', 'Exibir dicas para resolução')
    .option('--com-testes', 'Exibir casos de teste esperados')
    .action((opts) => {
      console.log(getBanner());

      if (opts.id) {
        const ch = challengeService.findChallengeById(opts.id);
        if (!ch) {
          console.log(chalk.red(`❌ Desafio com ID "${opts.id}" não encontrado.\n`));
          return;
        }
        console.log(formatChallenge(ch, { showHints: opts.comDicas, showTests: opts.comTestes }));
        return;
      }

      const matched = challengeService.queryChallenges({
        technology: opts.tech,
        level: opts.nivel,
        trackId: opts.trilha
      });

      if (matched.length === 0) {
        console.log(chalk.yellow('⚠️  Nenhum desafio encontrado para os parâmetros informados.'));
        console.log(chalk.gray(`Parâmetros: Tech=${opts.tech || 'Qualquer'}, Nível=${opts.nivel || 'Qualquer'}\n`));
        return;
      }

      // Pick the first or filtered
      const selected = matched[0];
      console.log(chalk.bold.green(`🎯 Desafio selecionado para sua jornada (${matched.length} disponível(is)):\n`));
      console.log(
        formatChallenge(selected, {
          showHints: opts.comDicas ?? true,
          showTests: opts.comTestes ?? true
        })
      );
    });

  // Comando: certificado
  program
    .command('certificado')
    .alias('cert')
    .description('Cria um certificado fictício para uma trilha concluída')
    .option('-a, --aluno <nome>', 'Nome do estudante / explorador')
    .option('-t, --trilha <id>', 'ID da trilha concluída (ex: python-ai, geo-spatial, javascript-fullstack)')
    .option('-n, --nota <aproveitamento>', 'Grau de aproveitamento', 'Excelente')
    .option('-f, --formato <formato>', 'Formatos de saída: html, svg, json, all', 'all')
    .option('-o, --output <diretorio>', 'Diretório de destino', './certificates')
    .option('-v, --verificar <codigo>', 'Verificar autenticidade de um código ou ID de certificado')
    .action((opts) => {
      console.log(getBanner());

      if (opts.verificar) {
        const verifyRes = certificateService.verifyCertificate(opts.verificar);
        if (verifyRes.valid) {
          console.log(chalk.bold.green('✅ AUTENTICIDADE CONFIRMADA'));
          console.log(chalk.white(verifyRes.message));
          if (verifyRes.details) {
            console.log(chalk.gray(JSON.stringify(verifyRes.details, null, 2)));
          }
        } else {
          console.log(chalk.bold.red('❌ CERTIFICADO NÃO RECONHECIDO'));
          console.log(chalk.red(verifyRes.message));
        }
        console.log();
        return;
      }

      if (!opts.aluno || !opts.trilha) {
        console.log(chalk.yellow('⚠️  Para emitir o certificado, informe o nome do aluno (--aluno) e a trilha (--trilha).'));
        console.log(chalk.gray('Exemplo: geo-explorer certificado --aluno "Ada Lovelace" --trilha python-ai\n'));
        return;
      }

      try {
        const formats: Array<'html' | 'svg' | 'json'> =
          opts.formato === 'all'
            ? ['html', 'svg', 'json']
            : (opts.formato.split(',').map((f: string) => f.trim()) as Array<'html' | 'svg' | 'json'>);

        const result = certificateService.generateCertificate({
          studentName: opts.aluno,
          trackId: opts.trilha,
          grade: opts.nota,
          outputDir: opts.output,
          formats
        });

        console.log(formatCertificateTerminal(result.certificate, result.files));
      } catch (err: any) {
        console.log(chalk.red(`❌ Erro ao emitir certificado: ${err.message}\n`));
      }
    });

  // Comando: mcp
  program
    .command('mcp')
    .description('Inicia o Servidor MCP (Model Context Protocol) via Stdio')
    .action(async () => {
      const { startMcpServer } = await import('./mcp/server.js');
      await startMcpServer();
    });

  // Comando: interativo (explorar)
  program
    .command('explorar')
    .alias('interactive')
    .description('Abre o menu interativo com assistente de navegação')
    .action(async () => {
      await runInteractiveMode();
    });

  return program;
}

export async function runInteractiveMode(): Promise<void> {
  const { select, input } = await import('@inquirer/prompts');

  console.log(getBanner());

  let keepRunning = true;

  while (keepRunning) {
    const action = await select({
      message: '🗺️ O que você deseja explorar no Geo-Explorer?',
      choices: [
        { name: '1. 📍 Consultar Trilhas de Aprendizagem', value: 'trilhas' },
        { name: '2. 🎯 Obter um Desafio de Código', value: 'desafio' },
        { name: '3. 🎓 Emitir Certificado Fictício', value: 'certificado' },
        { name: '4. 🔍 Verificar Autenticidade de Certificado', value: 'verificar' },
        { name: '5. 🤖 Iniciar Servidor MCP (Model Context Protocol)', value: 'mcp' },
        { name: '6. 🚪 Sair do Explorador', value: 'sair' }
      ]
    });

    switch (action) {
      case 'trilhas': {
        const tracks = trackService.getAllTracks();
        const chosenTrackId = await select({
          message: 'Selecione uma trilha para inspecionar:',
          choices: [
            ...tracks.map((t) => ({
              name: `${t.name} (${t.technology} - ${t.level})`,
              value: t.id
            })),
            { name: '← Voltar ao Menu Principal', value: 'back' }
          ]
        });

        if (chosenTrackId !== 'back') {
          const track = trackService.findTrackById(chosenTrackId);
          if (track) {
            console.log(formatTrackDetails(track));
          }
        }
        break;
      }

      case 'desafio': {
        const tech = await select({
          message: 'Escolha a tecnologia para o desafio:',
          choices: [
            { name: 'Python (IA & Análise)', value: 'python' },
            { name: 'GIS & Python (Geospatial & Mapas)', value: 'gis' },
            { name: 'JavaScript & Node.js (Web & APIs)', value: 'javascript' },
            { name: 'DevOps (Docker & Kubernetes)', value: 'devops' },
            { name: 'C# .NET (Clean Architecture)', value: 'c#' }
          ]
        });

        const level = await select({
          message: 'Escolha o nível de dificuldade:',
          choices: [
            { name: 'Iniciante', value: 'iniciante' },
            { name: 'Intermediário', value: 'intermediario' },
            { name: 'Avançado', value: 'avancado' }
          ]
        });

        const challenge = challengeService.getChallenge({ technology: tech, level: level as DifficultyLevel });
        if (challenge) {
          console.log(formatChallenge(challenge, { showHints: true, showTests: true }));
        } else {
          console.log(chalk.yellow('Nenhum desafio encontrado para essa combinação.'));
        }
        break;
      }

      case 'certificado': {
        const studentName = await input({
          message: 'Informe o nome do explorador(a) / aluno(a):',
          validate: (val) => (val.trim().length > 1 ? true : 'Por favor informe um nome válido.')
        });

        const tracks = trackService.getAllTracks();
        const chosenTrackId = await select({
          message: 'Selecione a trilha concluída:',
          choices: tracks.map((t) => ({
            name: `${t.name} (${t.technology})`,
            value: t.id
          }))
        });

        const result = certificateService.generateCertificate({
          studentName,
          trackId: chosenTrackId,
          formats: ['html', 'svg', 'json']
        });

        console.log(formatCertificateTerminal(result.certificate, result.files));
        break;
      }

      case 'verificar': {
        const code = await input({
          message: 'Digite o código de verificação (ex: GEO-XXXX-XXXX-XXXX) ou o ID:',
          validate: (val) => (val.trim().length > 0 ? true : 'Informe um código.')
        });

        const verifyRes = certificateService.verifyCertificate(code);
        if (verifyRes.valid) {
          console.log(chalk.bold.green('\n✅ CERTIFICADO AUTÊNTICO E VÁLIDO'));
          console.log(chalk.white(verifyRes.message));
          if (verifyRes.details) {
            console.log(chalk.gray(JSON.stringify(verifyRes.details, null, 2)));
          }
        } else {
          console.log(chalk.bold.red('\n❌ NÃO AUTENTICADO:'), verifyRes.message);
        }
        console.log();
        break;
      }

      case 'mcp': {
        console.log(chalk.cyan('Iniciando o Servidor MCP via Stdio...'));
        const { startMcpServer } = await import('./mcp/server.js');
        await startMcpServer();
        keepRunning = false;
        break;
      }

      case 'sair': {
        console.log(chalk.cyan('\n👋 Obrigado por navegar pelo Geo-Explorer! Até a próxima expedição.\n'));
        keepRunning = false;
        break;
      }
    }
  }
}
