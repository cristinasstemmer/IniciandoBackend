import { Farmácia } from "./farmacia";
import * as leitor from "readline-sync"



main()

async function main() {
    
    while (true){
        const farmacia = new Farmácia()

        console.log(`Seja bem-vindo ao sistema da farmácia 3KTI Farm!`);
        console.log(`1 - Comprar medicamento`);
        console.log(`2 - Vender medicamento`);
        console.log(`3 - Inserir medicamento`);
        console.log(`4 - Substituir medicamento`);
        console.log(`5 - Deletar medicamento`);
        console.log(`6 - Deletar usuario`);
        console.log(`7 - Visualizar estoque`);
        console.log(`8 - Visualizar usuarios`);
        console.log(`9 - Cadastrar usuarios`);
        console.log(`0 - Sair`);

        let opcao = leitor.questionInt(`Informe a opcao desejada: `)

        switch (opcao) {
            case 1:
                await farmacia.compraMedicamento()
                break;
            case 2:
                await farmacia.vendaMedicamento()
                break; 
            case 3:
                await farmacia.insercaoMedicamento()
                break;
            case 4:
                await farmacia.substituicaoMedicamento()
                break;
            case 5:
                await farmacia.remocaoMedicamento()
                break;
            case 6:
                await farmacia.remocaoUsuario()
                break;
            case 7:
                await farmacia.getEstoque()
                break;
            case 8:
                await farmacia.getUsuarios()
                break;
            case 9:
                await farmacia.insercaoUsuario()
                break;
            case 0:
                console.log(`Saindo, volte sempre.\n`);
                process.exit(0);
            default:
                console.log(`Opção inválida!\n`);
                break;
        }

    }
}
