const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bancosolar',
    password: '1234',
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

async function insertar(nombre, balance) {
    const client = await pool.connect()

    const { rows } = await client.query({
        text: `insert into usuarios (nombre, balance) values ($1, $2)`,
        values: [nombre, balance]
    });
    
    return rows;
}

async function consultar() {
    let client 
    try{
        client = await pool.connect();
    } catch (conn_error) {
        console.log("Client Error")
    }

    let res;
    try{
        res = await client.query({
            text: `select * from usuarios`
        });
    } catch (err) {
        console.log("El error es: " + err)
        return;
    }
    
    client.release()
    return res.rows;
}

module.exports = {insertar}