import { SistemaBiblioteca } from "./biblio";
import * as leitor from "readline-sync"

main()

async function main() {
    
    while (true){
        const biblioteca = new SistemaBiblioteca()

        console.log(`Seja bem-vindo ao sistema de biblioteca!`);
        console.log(`1 - Cadastrar Livro`);
        console.log(`2 - Cadastrar Usuário`);
        console.log(`3 - Emprestar Livro`);
        console.log(`4 - Devolver Livro`);
        console.log(`5 - Livros Disponíveis`);
        console.log(`6 - Deletar Usuário`);
        console.log(`7 - Deletar Livros`);
        console.log(`0 - Sair`);

        let opcao = leitor.questionInt(`Informe a opção desejada: `)

        switch (opcao) {
            case 1:
                await biblioteca.cadastrarLivro()
                break;
            case 2:
                await biblioteca.cadastrarUsuario()
                break;
            case 3:
                await biblioteca.emprestarLivros()
                break;
            case 4:
                await biblioteca.devolverLivro()
                break;
            case 5:
                await biblioteca.visualizarLivros()
                break;
            case 6:
                await biblioteca.deletarUsuario()
                break;
            case 7:
                await biblioteca.deletarLivro()
                break;
            case 0:
                console.log(`Saindo, volte sempre.`);
                process.exit(0);
            default:
                console.log(`Opção inválida!\n`);
                break;
        }

    }
}
/*

while(true){

    console.log(`Seja bem-vindo ao sistema de biblioteca!`);
    console.log(`1 - Cadastrar Livro`);
    console.log(`2 - Cadastrar Usuário`);
    console.log(`3 - Emprestar Livro`);
    console.log(`4 - Devolver Livro`);
    console.log(`5 - Livros Disponíveis`);
    console.log(`6 - Deletar Usuário`);
    console.log(`7 - Deletar Livros`);
    console.log(`0 - Sair`);
    
    
    let opcao = leitor.questionInt(`Informe a opção desejada: `)

    switch (opcao) {
        case 1:
            biblioteca.cadastrarLivro()
            break;
        case 2:
            biblioteca.cadastrarUsuario()
            break;
        case 3:
            biblioteca.emprestarLivro()
            break;
        case 4:
            biblioteca.devolverLivro()
            break;
        case 5:
            biblioteca.consultarLivrosDisponiveis()
            break;
        case 6:
            biblioteca.deleteUsuario()
            break;
        case 7:
            biblioteca.deleteLivros()
            break;
        case 0:
            console.log(`Saindo, volte sempre.`);
            process.exit(0);
        default:
            console.log(`Opção inválida!\n`);
            break;
    }
    
} */