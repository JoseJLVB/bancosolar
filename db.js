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

async function getUsuarios() {
    const client = await pool.connect()
    const { rows } = await client.query('select * from usuarios')
    return rows
};

module.exports = {insertar, getUsuarios}