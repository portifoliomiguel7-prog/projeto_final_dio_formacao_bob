import * as oportunidades from "./commands/oportunidades";
import * as buscar from "./commands/buscar";
import * as analisar from "./commands/analisar";
import * as proposta from "./commands/proposta";

/**
 * CLI entry point.
 * Accepts commands with or without leading slash:
 *   oportunidades | /oportunidades
 *   buscar <term>  | /buscar <term>
 *   analisar <id>  | /analisar <id>
 *   proposta <id>  | /proposta <id>
 */
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  // Strip optional leading slash so both "/buscar" and "buscar" work
  const command = args[0].replace(/^\//, "").toLowerCase();
  const argument = args[1];

  switch (command) {
    case "oportunidades":
      oportunidades.run();
      break;

    case "buscar":
      buscar.run(argument);
      break;

    case "analisar":
      analisar.run(argument);
      break;

    case "proposta":
      proposta.run(argument);
      break;

    default:
      console.error(`Erro: comando desconhecido "${args[0]}".`);
      printUsage();
      process.exit(1);
  }
}

function printUsage(): void {
  console.log(
    [
      "Uso: npm run dev -- <comando> [argumento]",
      "",
      "Comandos disponíveis:",
      "  oportunidades          Lista todas as oportunidades",
      "  buscar <termo>         Pesquisa oportunidades pelo termo",
      "  analisar <id>          Analisa uma oportunidade por ID",
      "  proposta <id>          Gera proposta para uma oportunidade por ID",
    ].join("\n")
  );
}

main();
