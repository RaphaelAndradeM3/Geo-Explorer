import chalk from 'chalk';
import { CertificateData, CodeChallenge, Track } from '../types/index.js';
import { EnrichedChallenge } from '../services/challengeService.js';

export function getBanner(): string {
  const line = '━'.repeat(64);
  return `
${chalk.cyan(line)}
${chalk.bold.hex('#38BDF8')('   🌍  GEO-EXPLORER  ')} ${chalk.gray('•')} ${chalk.yellow('Trilhas de Aprendizagem & Desafios')}
${chalk.dim('   Plataforma de Expedição Educacional com Suporte a Servidor MCP')}
${chalk.cyan(line)}
`;
}

export function formatTrackSummary(track: Track): string {
  const levelBadge =
    track.level === 'iniciante'
      ? chalk.bgGreen.black(' INICIANTE ')
      : track.level === 'intermediario'
      ? chalk.bgYellow.black(' INTERMEDIÁRIO ')
      : chalk.bgRed.white(' AVANÇADO ');

  return `
${chalk.bold.white('📍 Trilha:')} ${chalk.bold.cyan(track.name)} ${levelBadge}
${chalk.gray('ID:')} ${chalk.white(track.id)}  ${chalk.gray('│')}  ${chalk.gray('Tech:')} ${chalk.magentaBright(track.technology)}  ${chalk.gray('│')}  ${chalk.gray('Carga Horária:')} ${chalk.yellow(`${track.estimatedHours}h`)}
${chalk.gray('Descrição:')} ${track.description}
${chalk.gray('Módulos:')} ${chalk.cyan(track.modules.length.toString())} módulos cadastrados  ${chalk.gray('│')}  ${chalk.gray('Desafios:')} ${chalk.green(track.challenges.length.toString())} desafios
`;
}

export function formatTrackDetails(track: Track): string {
  const levelBadge =
    track.level === 'iniciante'
      ? chalk.bgGreen.black(' INICIANTE ')
      : track.level === 'intermediario'
      ? chalk.bgYellow.black(' INTERMEDIÁRIO ')
      : chalk.bgRed.white(' AVANÇADO ');

  let output = `
${chalk.bold.hex('#38BDF8')('═'.repeat(64))}
${chalk.bold.white('TRILHA:')} ${chalk.bold.yellow(track.name.toUpperCase())} ${levelBadge}
${chalk.bold.hex('#38BDF8')('═'.repeat(64))}

${chalk.bold.cyan('ℹ️  Visão Geral')}
${chalk.gray('•')} ${chalk.bold('ID:')} ${track.id}
${chalk.gray('•')} ${chalk.bold('Tecnologia:')} ${chalk.magentaBright(track.technology)}
${chalk.gray('•')} ${chalk.bold('Categoria:')} ${track.category}
${chalk.gray('•')} ${chalk.bold('Carga Horária Estimada:')} ${chalk.yellow(`${track.estimatedHours} horas`)}
${chalk.gray('•')} ${chalk.bold('Pré-requisitos:')} ${track.prerequisites.join(', ')}
${chalk.gray('•')} ${chalk.bold('Resumo:')} ${track.description}

${chalk.bold.cyan('📚 Módulos de Aprendizagem')}
`;

  track.modules.forEach((mod, index) => {
    output += `
  ${chalk.bold.yellow(`${index + 1}. ${mod.title}`)} ${chalk.dim(`(${mod.durationHours}h)`)}
     ${chalk.gray(mod.description)}
     ${chalk.dim('Tópicos:')} ${mod.topics.map((t) => chalk.blue(`[${t}]`)).join(' ')}
`;
  });

  output += `
${chalk.bold.cyan('🎯 Desafios Práticos de Código na Trilha')}
`;

  track.challenges.forEach((ch, idx) => {
    const chBadge =
      ch.level === 'iniciante'
        ? chalk.green('[Iniciante]')
        : ch.level === 'intermediario'
        ? chalk.yellow('[Intermediário]')
        : chalk.red('[Avançado]');
    output += `  ${idx + 1}. ${chBadge} ${chalk.bold(ch.title)} ${chalk.dim(`(ID: ${ch.id})`)}\n`;
  });

  output += chalk.bold.hex('#38BDF8')('═'.repeat(64)) + '\n';
  return output;
}

export function formatChallenge(
  challenge: EnrichedChallenge,
  options: { showHints?: boolean; showTests?: boolean } = {}
): string {
  const levelBadge =
    challenge.level === 'iniciante'
      ? chalk.bgGreen.black(' NÍVEL: INICIANTE ')
      : challenge.level === 'intermediario'
      ? chalk.bgYellow.black(' NÍVEL: INTERMEDIÁRIO ')
      : chalk.bgRed.white(' NÍVEL: AVANÇADO ');

  let output = `
${chalk.bold.green('┏' + '━'.repeat(62) + '┓')}
   ${chalk.bold.white('DESAFIO DE CÓDIGO:')} ${chalk.bold.cyan(challenge.title)}
   ${levelBadge}  ${chalk.gray('Trilha:')} ${chalk.magentaBright(challenge.trackName)}
${chalk.bold.green('┣' + '━'.repeat(62) + '┫')}

${chalk.bold.yellow('📋 Descrição da Missão:')}
${challenge.description}

${chalk.bold.yellow('⚙️ Instruções de Implementação:')}
${challenge.instructions}

${chalk.bold.yellow('💻 Código Inicial (Starter Code):')}
${chalk.bgGray.white('───────────────────────────────────────────────────────')}
${chalk.white(challenge.starterCode)}
${chalk.bgGray.white('───────────────────────────────────────────────────────')}
`;

  if (options.showHints && challenge.hints && challenge.hints.length > 0) {
    output += `
${chalk.bold.blue('💡 Dicas do Explorador (Hints):')}
`;
    challenge.hints.forEach((hint, i) => {
      output += `  ${chalk.cyan(`${i + 1}.`)} ${hint}\n`;
    });
  }

  if (options.showTests && challenge.testCases && challenge.testCases.length > 0) {
    output += `
${chalk.bold.magenta('🧪 Casos de Teste (Test Cases):')}
`;
    challenge.testCases.forEach((tc, i) => {
      output += `  ${chalk.bold.white(`Caso #${i + 1}:`)} ${tc.description}\n`;
      output += `    ${chalk.gray('Entrada:')}  ${chalk.cyan(tc.input)}\n`;
      output += `    ${chalk.gray('Esperado:')} ${chalk.green(tc.expectedOutput)}\n`;
    });
  }

  output += chalk.bold.green('┗' + '━'.repeat(62) + '┛') + '\n';
  return output;
}

export function formatCertificateTerminal(cert: CertificateData, files?: { svg?: string; html?: string; json?: string }): string {
  let output = `
${chalk.bold.yellow('╔' + '═'.repeat(62) + '╗')}
║${chalk.bold.cyan('                  CERTIFICADO DE CONCLUSÃO                   ')}║
║${chalk.gray('                   Expedição Geo-Explorer                    ')}║
${chalk.bold.yellow('╠' + '═'.repeat(62) + '╣')}

   ${chalk.gray('Conferido com distinção a:')}
   ${chalk.bold.green.underline(cert.studentName.toUpperCase())}

   ${chalk.gray('Por ter completado com louvor a trilha:')}
   ${chalk.bold.white(cert.trackName)}
   ${chalk.gray('Tecnologia:')} ${chalk.magentaBright(cert.technology)}
   ${chalk.gray('Carga Horária Estimada:')} ${chalk.yellow(`${cert.durationHours} horas`)}
   ${chalk.gray('Aproveitamento:')} ${chalk.cyan(cert.grade || 'Excelente')}
   ${chalk.gray('Data de Conclusão:')} ${chalk.white(cert.completionDate)}

   ${chalk.gray('Habilidades Chave Validadas:')}
   ${cert.skillsAcquired.slice(0, 4).map((s) => chalk.blue(`• ${s}`)).join('\n   ')}

${chalk.bold.yellow('╠' + '═'.repeat(62) + '╣')}
   ${chalk.bold('ID do Certificado:')}  ${chalk.white(cert.id)}
   ${chalk.bold('Código Verificador:')} ${chalk.bold.cyan(cert.verificationCode)}
   ${chalk.bold('Emissor:')}            ${chalk.gray(cert.instructor)}
${chalk.bold.yellow('╚' + '═'.repeat(62) + '╝')}
`;

  if (files) {
    output += `\n${chalk.bold.green('🎉 Arquivos exportados com sucesso:')}\n`;
    if (files.html) output += `  ${chalk.bold.white('• HTML:')} ${chalk.cyan(files.html)}\n`;
    if (files.svg)  output += `  ${chalk.bold.white('• SVG:')}  ${chalk.cyan(files.svg)}\n`;
    if (files.json) output += `  ${chalk.bold.white('• JSON:')} ${chalk.cyan(files.json)}\n`;
  }

  return output;
}
