"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SistemaBiblioteca = void 0;
const leitor = __importStar(require("readline-sync"));
const db_1 = __importDefault(require("./db"));
class Livro {
    constructor(titulo, autor, anoPublicacao, quantidadeDisponivel) {
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.quantidadeDisponivel = quantidadeDisponivel;
    }
}
class Usuario {
    constructor(nome, email) {
        this.nome = nome;
        this.email = email;
    }
}
class SistemaBiblioteca {
    constructor() {
        this.usuarios = [];
        this.livros = [];
    }
    cadastrarLivro() {
        let titulo = leitor.question(`Informe o título: `);
        let anoPublicacao = leitor.questionInt(`Informe o ano de publicação: `);
        let autor = leitor.question(`Informe o autor: `);
        let quantidadeDisponivel = leitor.questionInt(`Informe a quantidade em estoque: `);
        let livro = new Livro(titulo, autor, anoPublicacao, quantidadeDisponivel);
        this.criarLivroBanco(livro);
    }
    criarLivroBanco(livro) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield executeDatabaseQuery(`INSERT INTO livros (titulo, ano, autor, quantidade) VALUES (?, ?, ?, ?)`, [livro.titulo, livro.anoPublicacao, livro.autor, livro.quantidadeDisponivel]);
                console.log(`\nLivro: ${livro.titulo} inserido na BD com sucesso!`);
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    cadastrarUsuario() {
        let nome = leitor.question(`Informe o nome: `);
        let email = leitor.question(`Informe o email: `);
        let usuario = new Usuario(nome, email);
        this.criarUsuarioBanco(usuario);
    }
    criarUsuarioBanco(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield executeDatabaseQuery(`INSERT INTO usuarios (nome, email) VALUES (?, ?)`, [usuario.nome, usuario.email]);
                console.log(`\nUsuario: ${usuario.nome} inserido na BD com sucesso!`);
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    emprestarLivros() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usuariosBanco();
            let id_usuarios = leitor.questionInt("Insira o ID do usuario: ");
            yield this.livrosBanco();
            let id_livros = leitor.questionInt("Insira o ID do livro: ");
            try {
                yield executeDatabaseQuery((`INSERT INTO sistemabiblioteca(id_usuarios, id_livros) VALUES (?, ?)`), [id_usuarios, id_livros]);
                yield executeDatabaseQuery(`UPDATE livros SET quantidade = quantidade - 1 WHERE id_livros = ?`, [id_livros]);
                console.log("Livro emprestado com sucesso.");
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    devolverLivro() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.emprestimosBanco();
            let idEmprestimo = leitor.questionInt("Insira o ID do emprestimo: ");
            try {
                console.log(yield executeDatabaseQuery("SELECT id_livros FROM sistemabiblioteca WHERE id_biblioteca = ?", [idEmprestimo]));
            }
            catch (err) {
                console.log('Erro: ', err);
            }
            let idLivro = leitor.questionInt("Infore o ID do livro que foi mostrado acima para confirmar: ");
            try {
                yield executeDatabaseQuery(`DELETE FROM sistemabiblioteca WHERE id_biblioteca = ?`, [idEmprestimo]);
                yield executeDatabaseQuery(`UPDATE livros SET quantidade = quantidade + 1 WHERE id_livros = ?`, [idLivro]);
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    deletarUsuario() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usuariosBanco();
            let id_usuario = leitor.questionInt("Informe o ID do usuario a ser deletado: ");
            try {
                yield executeDatabaseQuery("DELETE FROM usuarios WHERE id_usuarios = ?", [id_usuario]);
                console.log(`Usuario deletado com sucesso`);
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    deletarLivro() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.livrosBanco();
            let id_livro = leitor.questionInt("Informe o ID do livro a ser deletado: ");
            try {
                yield executeDatabaseQuery("DELETE FROM usuarios WHERE id_livros = ?", [id_livro]);
                console.log(`Livro deletado com sucesso`);
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    visualizarUsuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usuariosBanco();
        });
    }
    visualizarLivros() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.livrosBanco();
        });
    }
    usuariosBanco() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarios = yield executeDatabaseQuery("SELECT * FROM usuarios", []);
                console.log('Base de dados de Usuarios: ');
                return usuarios.forEach(({ id_usuarios, nome, email }) => {
                    console.log(`ID: ${id_usuarios}, \nNome: ${nome}, \nEmail: ${email}`);
                });
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    livrosBanco() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const livros = yield executeDatabaseQuery("SELECT * FROM livros", []);
                console.log('Base de dados de Livros: ');
                return livros.forEach(({ id_livros, titulo, ano, autor, quantidade }) => {
                    console.log(`ID: ${id_livros}, \nTítulo: ${titulo}, \nAno: ${ano}, \nAutor: ${autor}, \nQuantidade disponivel: ${quantidade}`);
                });
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    emprestimosBanco() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emprestimos = yield executeDatabaseQuery(`SELECT sistemabiblioteca.id_biblioteca, usuarios.nome, livros.titulo FROM sistemabiblioteca INNER JOIN usuarios ON usuarios.id_usuarios = sistemabiblioteca.id_usuarios INNER JOIN livros ON livros.id_livros = sistemabiblioteca.id_livros
            `, []);
                console.log(`Livros emprestados: `);
                emprestimos.forEach(({ id_biblioteca, nome, titulo }) => {
                    console.log(`\nID do Emprestimo: ${id_biblioteca} \nUsuario: ${nome} \nLivro: ${titulo}\n`);
                });
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
}
exports.SistemaBiblioteca = SistemaBiblioteca;
function executeDatabaseQuery(query, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.execute(query, params);
            return result;
        }
        catch (err) {
            console.error('Erro na execucao da consulta', err);
            throw err;
        }
    });
}
