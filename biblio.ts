import * as leitor from "readline-sync"
import banco from "./db"

class Livro{
    public titulo: string
    public autor: string
    public anoPublicacao: number
    public quantidadeDisponivel: number

    constructor(titulo: string, autor: string, anoPublicacao: number, quantidadeDisponivel: number){
        this.titulo = titulo
        this.autor = autor
        this.anoPublicacao = anoPublicacao
        this.quantidadeDisponivel = quantidadeDisponivel
    }
}

class Usuario{
    public nome: string
    public email: string

    constructor(nome: string, email: string){
        this.nome = nome        
        this.email = email
    }
}
/*
interface Biblioteca{
    cadastrarLivro(): void
    cadastrarUsuario(): void
    emprestarLivro(): void
    devolverLivro(): void
    consultarLivrosDisponiveis(): void
}
*/
export class SistemaBiblioteca{ /* implements Biblioteca{ */

   usuarios: Array<Usuario> = []
   livros: Array<Livro> = []

    public cadastrarLivro(): void {

        let titulo =                leitor.question(`Informe o título: `)
        let anoPublicacao =         leitor.questionInt(`Informe o ano de publicação: `)
        let autor =                 leitor.question(`Informe o autor: `)
        let quantidadeDisponivel =  leitor.questionInt(`Informe a quantidade em estoque: `)

        let livro = new Livro(titulo, autor, anoPublicacao, quantidadeDisponivel)

        this.criarLivroBanco(livro)

    }

    async criarLivroBanco(livro: Livro): Promise<void>{
        try {
            await executeDatabaseQuery(`INSERT INTO livros (titulo, ano, autor, quantidade) VALUES (?, ?, ?, ?)` , [livro.titulo, livro.anoPublicacao, livro.autor, livro.quantidadeDisponivel])
            console.log(`\nLivro: ${livro.titulo} inserido na BD com sucesso!`)
        } catch (err) {
            console.log('Erro: ', err);
            
        }
        
     } 
    public cadastrarUsuario(): void {

        let nome =  leitor.question(`Informe o nome: `)         
        let email = leitor.question(`Informe o email: `) 

        let usuario = new Usuario(nome, email)
        this.criarUsuarioBanco(usuario)

    }
   async criarUsuarioBanco(usuario: any) {
        try {
            await executeDatabaseQuery(`INSERT INTO usuarios (nome, email) VALUES (?, ?)` , [usuario.nome, usuario.email])
            console.log(`\nUsuario: ${usuario.nome} inserido na BD com sucesso!`)
        } catch (err) {
            console.log('Erro: ', err);
        }

    }
    async emprestarLivros(): Promise<void> {
        await this.usuariosBanco()
        let id_usuarios = leitor.questionInt("Insira o ID do usuario: ")

        await this.livrosBanco()
        let id_livros = leitor.questionInt("Insira o ID do livro: ")
        try {
            await executeDatabaseQuery((`INSERT INTO sistemabiblioteca(id_usuarios, id_livros) VALUES (?, ?)`),[id_usuarios, id_livros])
            await executeDatabaseQuery(`UPDATE livros SET quantidade = quantidade - 1 WHERE id_livros = ?`, [id_livros])
            console.log("Livro emprestado com sucesso.")
        } catch (err) {
            console.log('Erro: ', err);
        }
         }
    
    async devolverLivro(): Promise<void> {
        await this.emprestimosBanco()
        let idEmprestimo = leitor.questionInt("Insira o ID do emprestimo: ")

        try {
            console.log(await executeDatabaseQuery("SELECT id_livros FROM sistemabiblioteca WHERE id_biblioteca = ?", [idEmprestimo]))

        } catch (err) {
            console.log('Erro: ', err);
        }

        let idLivro = leitor.questionInt("Infore o ID do livro que foi mostrado acima para confirmar: ")

        try {
            // deletar dos dados de emprestimo
             await executeDatabaseQuery(`DELETE FROM sistemabiblioteca WHERE id_biblioteca = ?`, [idEmprestimo])  
              // atualizar a quantidade em estoque do livro
              await executeDatabaseQuery(`UPDATE livros SET quantidade = quantidade + 1 WHERE id_livros = ?`, [idLivro])
        } catch (err) {
            console.log('Erro: ', err);
            }
        }

    async deletarUsuario(): Promise<void>{
        await this.usuariosBanco()
        let id_usuario = leitor.questionInt("Informe o ID do usuario a ser deletado: ")

        try {
            await executeDatabaseQuery("DELETE FROM usuarios WHERE id_usuarios = ?", [id_usuario])
            console.log(`Usuario deletado com sucesso`)
        } catch (err) {
            console.log('Erro: ', err);
        }
    }

    async deletarLivro(): Promise<void>{
        await this.livrosBanco()
        let id_livro = leitor.questionInt("Informe o ID do livro a ser deletado: ")

        try {
            await executeDatabaseQuery("DELETE FROM usuarios WHERE id_livros = ?", [id_livro])
            console.log(`Livro deletado com sucesso`)
        } catch (err) {
            console.log('Erro: ', err);
        }
    }


     // getters: 

     async visualizarUsuarios(): Promise<void> {
        await this.usuariosBanco()
    }

    async visualizarLivros(): Promise<void> {
        await this.livrosBanco()
    }

    async usuariosBanco(): Promise<void> {
        try {
            const usuarios = await executeDatabaseQuery("SELECT * FROM usuarios", [])
            console.log('Base de dados de Usuarios: ');
            return usuarios.forEach(({id_usuarios, nome, email}: any) => {
                console.log(`ID: ${id_usuarios}, \nNome: ${nome}, \nEmail: ${email}`);
            })
        } catch (err) {
            console.log('Erro: ', err);
        }
    }

    async livrosBanco(): Promise<void> {
        try {
            const livros = await executeDatabaseQuery("SELECT * FROM livros", [])
            console.log('Base de dados de Livros: ');
            return livros.forEach(({id_livros, titulo, ano, autor, quantidade}: any) => {
                console.log(`ID: ${id_livros}, \nTítulo: ${titulo}, \nAno: ${ano}, \nAutor: ${autor}, \nQuantidade disponivel: ${quantidade}`);
            })
        } catch (err) {
            console.log('Erro: ', err);
        }
    }

    async emprestimosBanco(): Promise<void> {
        try {
            const emprestimos = await executeDatabaseQuery(`SELECT sistemabiblioteca.id_biblioteca, usuarios.nome, livros.titulo FROM sistemabiblioteca INNER JOIN usuarios ON usuarios.id_usuarios = sistemabiblioteca.id_usuarios INNER JOIN livros ON livros.id_livros = sistemabiblioteca.id_livros
            `, [])

            console.log(`Livros emprestados: `);
            emprestimos.forEach(({id_biblioteca, nome, titulo}: any) => {
                console.log(`\nID do Emprestimo: ${id_biblioteca} \nUsuario: ${nome} \nLivro: ${titulo}\n`)
            });

        } catch (err) {
            console.log('Erro: ', err);
        }
    } }

    async function executeDatabaseQuery(query: string, params: any[]): Promise<any> {
        try {
            const result = await banco.execute(query, params)
            return result
        } catch (err) {
           console.error('Erro na execucao da consulta', err);
           throw err
        }
    }