#!/usr/bin/env node

import { createCli, runInteractiveMode } from './cli.js';

async function main(): Promise<void> {
  const cli = createCli();

  // Se nenhum argumento foi informado, execute o modo interativo
  if (process.argv.length <= 2) {
    await runInteractiveMode();
    return;
  }

  await cli.parseAsync(process.argv);
}

main().catch((err) => {
  console.error('Erro na execução do Geo-Explorer:', err);
  process.exit(1);
});
