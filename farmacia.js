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
exports.Farmácia = void 0;
const leitor = __importStar(require("readline-sync"));
const dbfarmacia_1 = __importDefault(require("./dbfarmacia"));
class Medicamento {
    constructor(nome, preco, estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }
}
class Usuario {
    constructor(nome, idade, endereco) {
        this.nome = nome;
        this.idade = idade;
        this.endereco = endereco;
    }
}
class Farmácia {
    compraMedicamento() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usuariosBanco();
            let id_usuario = leitor.questionInt("Insira o ID do usuario: ");
            yield this.medicamentosBanco();
            let id_medicamento = leitor.questionInt("Insira o ID do medicamento: ");
            try {
                yield executeDatabaseQuery((`INSERT INTO sistemafarmacia(id_usuario, id_medicamento) VALUES (?, ?)`), [id_usuario, id_medicamento]);
                yield executeDatabaseQuery(`UPDATE medicamentos SET estoque = estoque - 1 WHERE id_medicamento = ?`, [id_medicamento]);
                let precoCompra = yield executeDatabaseQuery(`SELECT preco FROM medicamentos WHERE id_medicamento = ?`, [id_medicamento]);
                var valor = precoCompra[0].preco;
                var nomeMed = yield executeDatabaseQuery(`SELECT nome FROM medicamentos WHERE id_medicamento = ?`, [id_medicamento]);
                var nomeMedicamento = nomeMed[0];
                var nomeRemedioComprado = nomeMedicamento.nome;
                console.log(`O medicamento ${nomeRemedioComprado} custou R$${valor}.`);
                yield executeDatabaseQuery(`UPDATE financeiro SET saldo = saldo + ?`, [valor]);
                console.log("Medicamento comprado com sucesso.\n");
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    vendaMedicamento() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usuariosBanco();
            let id_usuario = leitor.questionInt("Insira o ID do usuario: ");
            yield this.medicamentosBanco();
            let id_medicamento = leitor.questionInt("Insira o ID do medicamento a ser vendido: \n");
            let valorMedicamentoVendido = leitor.questionInt("Insira o valor total a ser pago pelo medicamento vendido: \n");
            try {
                yield executeDatabaseQuery((`INSERT INTO sistemafarmacia(id_usuario, id_medicamento) VALUES (?, ?)`), [id_usuario, id_medicamento]);
                yield executeDatabaseQuery(`UPDATE medicamentos SET estoque = estoque + 1 WHERE id_medicamento = ?`, [id_medicamento]);
                var nomeMed = yield executeDatabaseQuery(`SELECT nome FROM medicamentos WHERE id_medicamento = ?`, [id_medicamento]);
                var nomeMedicamento = nomeMed[0].nome;
                console.log(nomeMedicamento);
                yield executeDatabaseQuery(`UPDATE financeiro SET saldo = saldo - ?`, [valorMedicamentoVendido]);
                console.log(`\nMedicamento ${nomeMedicamento} vendido com sucesso pelo valor de R$${valorMedicamentoVendido}. Obrigada pela parceria!\n`);
            }
            catch (err) {
                console.log('Erro: ', err);
            }
        });
    }
    substituicaoMedicamento() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.medicamentosBanco();
            let id_medicamento = leitor.questionInt("Insira o ID do medicamento a ser subtituido: ");
            let nome_medicamento2 = leitor.question("Insira o nome do medicamento a substituir o medicamento anterior: ");
            let preco_medicamento2 = leitor.questionInt("Insira o preco unitario do novo medicamento: ");
            let estoque_medicamento2 = leitor.questionInt("Informe a quantidade em estoque do novo medicamento a ser inserido: ");
            try {
                yield executeDatabaseQuery(`DELETE FROM medicamentos WHERE id_medicamento = ?`, [id_medicamento]);
                yield executeDatabaseQuery(`INSERT INTO medicamentos(nome, preco, estoque) VALUES (?, ?, ?)`, [nome_medicamento2, preco_medicamento2, estoque_medicamento2]);
                console.log("Medicamento substituido com sucesso.\n");
            }
            catch (err) {
                console.log("Erro: ", err);
            }
        });
    }
    insercaoMedicamento() {
        return __awaiter(this, void 0, void 0, function* () {
            let nome = leitor.question(`Informe o nome do medicamento: `);
            let preco = leitor.questionInt(`Informe o preco unitario do medicamento: `);
            let estoque = leitor.questionInt(`Informe a quantidade a ser inserida em estoque `);
            let medicamento = new Medicamento(nome, preco, estoque);
            try {
                yield executeDatabaseQuery(`INSERT INTO medicamentos (nome, preco, estoque) VALUES (?, ?, ?)`, [medicamento.nome, medicamento.preco, medicamento.estoque]);
                console.log(`\nMedicamento: ${medicamento.nome} inserido na BD com sucesso!\n`);
            }
            catch (err) {
                console.log("Erro: ", err);
            }
        });
    }
    remocaoMedicamento() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.medicamentosBanco();
            let id_medicamento = leitor.questionInt("Informe o ID do medicamento a ser deletado: ");
            try {
                yield executeDatabaseQuery(`DELETE FROM medicamentos WHERE id_medicamento = ?`, [id_medicamento]);
                console.log("Medicamento deletado com sucesso\n");
            }
            catch (err) {
                console.log("Erro: ", err);
            }
        });
    }
    remocaoUsuario() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usuariosBanco();
            let id_usuario = leitor.questionInt("Informe o ID do usuario a ser deletado: ");
            try {
                yield executeDatabaseQuery(`DELETE FROM usuario WHERE id_usuario = ?`, [
                    id_usuario,
                ]);
                console.log("Usuario deletado com sucesso\n");
            }
            catch (err) {
                console.log("Erro: ", err);
            }
        });
    }
    getEstoque() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.medicamentosBanco();
        });
    }
    medicamentosBanco() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const livros = yield executeDatabaseQuery(`SELECT * FROM medicamentos`, []);
                console.log("Estoque de Medicamentos: \n");
                return livros.forEach(({ id_medicamento, nome, preco, estoque }) => {
                    console.log(`ID: ${id_medicamento}, \nNome: ${nome}, \nPreco Unitario: ${preco}, \nQuantidade disponivel em estoque: ${estoque}\n`);
                });
            }
            catch (err) {
                console.log("Erro: ", err);
            }
        });
    }
    insercaoUsuario() {
        return __awaiter(this, void 0, void 0, function* () {
            let nome = leitor.question(`\nInforme o nome do usuario a ser cadastrado: `);
            let idade = leitor.questionInt(`\nInforme a idade do novo usuario: `);
            let endereco = leitor.question(`\nInforme o endereco do novo usuario: \n`);
            let usuario = new Usuario(nome, idade, endereco);
            try {
                yield executeDatabaseQuery(`INSERT INTO usuario (nome, idade, endereco) VALUES (?, ?, ?)`, [usuario.nome, usuario.idade, usuario.endereco]);
                console.log(`\nUsuario: ${usuario.nome} inserido na BD com sucesso!\n`);
            }
            catch (err) {
                console.log("Erro: ", err);
            }
        });
    }
    getUsuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usuariosBanco();
        });
    }
    usuariosBanco() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarios = yield executeDatabaseQuery(`SELECT * FROM usuario`, []);
                console.log("Lista de usuarios cadastrados:  ");
                return usuarios.forEach(({ id_usuario, nome, idade, endereco }) => {
                    console.log(`ID: ${id_usuario}, \nNome: ${nome}, \nIdade: ${idade}, \nEndereco: ${endereco}\n`);
                });
            }
            catch (err) {
                console.log("Erro: ", err);
            }
        });
    }
}
exports.Farmácia = Farmácia;
function executeDatabaseQuery(query, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield dbfarmacia_1.default.execute(query, params);
            return result;
        }
        catch (err) {
            console.error('Erro na execucao da consulta', err);
            throw err;
        }
    });
}
