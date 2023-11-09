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
Object.defineProperty(exports, "__esModule", { value: true });
const farmacia_1 = require("./farmacia");
const leitor = __importStar(require("readline-sync"));
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const farmacia = new farmacia_1.Farmácia();
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
            let opcao = leitor.questionInt(`Informe a opcao desejada: `);
            switch (opcao) {
                case 1:
                    yield farmacia.compraMedicamento();
                    break;
                case 2:
                    yield farmacia.vendaMedicamento();
                    break;
                case 3:
                    yield farmacia.insercaoMedicamento();
                    break;
                case 4:
                    yield farmacia.substituicaoMedicamento();
                    break;
                case 5:
                    yield farmacia.remocaoMedicamento();
                    break;
                case 6:
                    yield farmacia.remocaoUsuario();
                    break;
                case 7:
                    yield farmacia.getEstoque();
                    break;
                case 8:
                    yield farmacia.getUsuarios();
                    break;
                case 9:
                    yield farmacia.insercaoUsuario();
                    break;
                case 0:
                    console.log(`Saindo, volte sempre.\n`);
                    process.exit(0);
                default:
                    console.log(`Opção inválida!\n`);
                    break;
            }
        }
    });
}
