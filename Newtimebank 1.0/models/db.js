

const mysql = require('mysql2');

const config = {
    host: "localhost",
    port: 3306,
    database: "NewTimeBank",
    user: "root",
    password: "",
}

const connection = mysql.createConnection(config)

connection.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return;
    }
    console.log('Conectado ao banco de dados.');
});


const pool = mysql.createPool(config);

module.exports = pool;
