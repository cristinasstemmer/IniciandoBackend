"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mariadb = require("mariadb");
const banco = mariadb.createPool({
    host: 'localhost',
    port: 5000,
    user: 'root',
    password: '',
    database: 'farmacia',
    connectionLimit: 10
});
exports.default = banco;
banco.execute(`
    CREATE DATABASE IF NOT EXISTS farmacia;
`);
banco.execute(`
    CREATE TABLE IF NOT EXISTS medicamentos(
        id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        preco INT NOT NULL,
        estoque INT NOT NULL
    );
`);
banco.execute(`
    CREATE TABLE IF NOT EXISTS usuario(
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        idade INT NOT NULL,
        endereco VARCHAR(50) NOT NULL
    );   
`);
banco.execute(`
    CREATE TABLE IF NOT EXISTS sistemafarmacia(
        id_farmacia INT AUTO_INCREMENT PRIMARY KEY,
        id_medicamento INT NOT NULL,
        id_usuario INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento) ON DELETE CASCADE
    );   
`);
