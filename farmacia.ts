import * as leitor from "readline-sync";
import banco from "./dbfarmacia"

class Medicamento {
  public nome: string
  public preco: number
  public estoque: number

  constructor(nome: string, preco: number, estoque: number) {
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque;
  }
}

class Usuario {
  public nome: string
  public idade: number
  public endereco: string

  constructor(nome: string, idade: number, endereco: string){
      this.nome = nome        
      this.idade = idade
      this.endereco = endereco
  }
}


export class Farmácia {
   async compraMedicamento(): Promise<void> {
      await this.usuariosBanco()
      let id_usuario = leitor.questionInt("Insira o ID do usuario: ")

      await this.medicamentosBanco()
      let id_medicamento = leitor.questionInt("Insira o ID do medicamento: ")
      try {
          await executeDatabaseQuery((`INSERT INTO sistemafarmacia(id_usuario, id_medicamento) VALUES (?, ?)`),[id_usuario, id_medicamento])
          await executeDatabaseQuery(`UPDATE medicamentos SET estoque = estoque - 1 WHERE id_medicamento = ?`, [id_medicamento])
          let precoCompra = await executeDatabaseQuery(`SELECT preco FROM medicamentos WHERE id_medicamento = ?`, [id_medicamento])
          var valor = precoCompra[0].preco
          var nomeMed = await executeDatabaseQuery(`SELECT nome FROM medicamentos WHERE id_medicamento = ?`, [id_medicamento])
          var nomeMedicamento = nomeMed[0]
          var nomeRemedioComprado = nomeMedicamento.nome
          console.log(`O medicamento ${nomeRemedioComprado} custou R$${valor}.`)
          await executeDatabaseQuery(`UPDATE financeiro SET saldo = saldo + ?`, [valor])
          console.log("Medicamento comprado com sucesso.\n")
      } catch (err) {
          console.log('Erro: ', err);
      }
  } 

  async vendaMedicamento(): Promise<void> {
    await this.usuariosBanco()
      let id_usuario = leitor.questionInt("Insira o ID do usuario: ")

      await this.medicamentosBanco()
      let id_medicamento = leitor.questionInt("Insira o ID do medicamento a ser vendido: \n")
      let valorMedicamentoVendido = leitor.questionInt("Insira o valor total a ser pago pelo medicamento vendido: \n")
      try {
          await executeDatabaseQuery((`INSERT INTO sistemafarmacia(id_usuario, id_medicamento) VALUES (?, ?)`),[id_usuario, id_medicamento])
          await executeDatabaseQuery(`UPDATE medicamentos SET estoque = estoque + 1 WHERE id_medicamento = ?`, [id_medicamento])
          var nomeMed = await executeDatabaseQuery(`SELECT nome FROM medicamentos WHERE id_medicamento = ?`, [id_medicamento])
          var nomeMedicamento = nomeMed[0].nome
          console.log(nomeMedicamento)
          await executeDatabaseQuery(`UPDATE financeiro SET saldo = saldo - ?`, [valorMedicamentoVendido])
          console.log(`\nMedicamento ${nomeMedicamento} vendido com sucesso pelo valor de R$${valorMedicamentoVendido}. Obrigada pela parceria!\n`)
      } catch (err) {
          console.log('Erro: ', err);
      }
  } 

  async substituicaoMedicamento(): Promise<void> {
    await this.medicamentosBanco();
    let id_medicamento = leitor.questionInt(
      "Insira o ID do medicamento a ser subtituido: "
    );
    let nome_medicamento2 = leitor.question(
      "Insira o nome do medicamento a substituir o medicamento anterior: "
    );
    let preco_medicamento2 = leitor.questionInt(
      "Insira o preco unitario do novo medicamento: "
    );
    let estoque_medicamento2 = leitor.questionInt(
      "Informe a quantidade em estoque do novo medicamento a ser inserido: "
    );

    try {
      await executeDatabaseQuery(
        `DELETE FROM medicamentos WHERE id_medicamento = ?`,
        [id_medicamento]
      );
      await executeDatabaseQuery(
        `INSERT INTO medicamentos(nome, preco, estoque) VALUES (?, ?, ?)`,
        [nome_medicamento2, preco_medicamento2, estoque_medicamento2]
      );
      console.log("Medicamento substituido com sucesso.\n");
    } catch (err) {
      console.log("Erro: ", err);
    }
  }

  async insercaoMedicamento(): Promise<void> {
    let nome = leitor.question(`Informe o nome do medicamento: `);
    let preco = leitor.questionInt(`Informe o preco unitario do medicamento: `);
    let estoque = leitor.questionInt(
      `Informe a quantidade a ser inserida em estoque `
    );

    let medicamento = new Medicamento(nome, preco, estoque);

    try {
      await executeDatabaseQuery(
        `INSERT INTO medicamentos (nome, preco, estoque) VALUES (?, ?, ?)`,
        [medicamento.nome, medicamento.preco, medicamento.estoque]
      );
      console.log(
        `\nMedicamento: ${medicamento.nome} inserido na BD com sucesso!\n`
      );
    } catch (err) {
      console.log("Erro: ", err);
    }
  }

  async remocaoMedicamento(): Promise<void> {
    await this.medicamentosBanco();
    let id_medicamento = leitor.questionInt(
      "Informe o ID do medicamento a ser deletado: "
    );

    try {
      await executeDatabaseQuery(
        `DELETE FROM medicamentos WHERE id_medicamento = ?`,
        [id_medicamento]
      );
      console.log("Medicamento deletado com sucesso\n");
    } catch (err) {
      console.log("Erro: ", err);
    }
  }

  async remocaoUsuario(): Promise<void> {
    await this.usuariosBanco();
    let id_usuario = leitor.questionInt(
      "Informe o ID do usuario a ser deletado: "
    );

    try {
      await executeDatabaseQuery(`DELETE FROM usuario WHERE id_usuario = ?`, [
        id_usuario,
      ]);
      console.log("Usuario deletado com sucesso\n");
    } catch (err) {
      console.log("Erro: ", err);
    }
  }

  async getEstoque(): Promise<void> {
    await this.medicamentosBanco();
  }

  async medicamentosBanco(): Promise<void> {
    try {
      const livros = await executeDatabaseQuery(
        `SELECT * FROM medicamentos`,
        []
      );
      console.log("Estoque de Medicamentos: \n");
      return livros.forEach(({ id_medicamento, nome, preco, estoque }: any) => {
        console.log(
          `ID: ${id_medicamento}, \nNome: ${nome}, \nPreco Unitario: ${preco}, \nQuantidade disponivel em estoque: ${estoque}\n`
        );
      });
    } catch (err) {
      console.log("Erro: ", err);
    }
  }

  async insercaoUsuario(): Promise<void> {
    let nome = leitor.question(
      `\nInforme o nome do usuario a ser cadastrado: `
    );
    let idade = leitor.questionInt(`\nInforme a idade do novo usuario: `);
    let endereco = leitor.question(`\nInforme o endereco do novo usuario: \n`);

    let usuario = new Usuario(nome, idade, endereco);

    try {
      await executeDatabaseQuery(
        `INSERT INTO usuario (nome, idade, endereco) VALUES (?, ?, ?)`,
        [usuario.nome, usuario.idade, usuario.endereco]
      );
      console.log(`\nUsuario: ${usuario.nome} inserido na BD com sucesso!\n`);
    } catch (err) {
      console.log("Erro: ", err);
    }
  }

  async getUsuarios(): Promise<void> {
    await this.usuariosBanco();
  }

  async usuariosBanco(): Promise<void> {
    try {
      const usuarios = await executeDatabaseQuery(`SELECT * FROM usuario`, []);
      console.log("Lista de usuarios cadastrados:  ");
      return usuarios.forEach(({ id_usuario, nome, idade, endereco }: any) => {
        console.log(
          `ID: ${id_usuario}, \nNome: ${nome}, \nIdade: ${idade}, \nEndereco: ${endereco}\n`
        );
      });
    } catch (err) {
      console.log("Erro: ", err);
    }
  }
}

  async function executeDatabaseQuery(query: string, params: any[]): Promise<any> {
    try {
        const result = await banco.execute(query, params)
        return result
    } catch (err) {
       console.error('Erro na execucao da consulta', err);
       throw err
    }
}
