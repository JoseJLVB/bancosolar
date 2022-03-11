const { query } = require('express');
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

async function editUsuarios(id, nombre, balance) {
    const client = await pool.connect()
    
    const { rows } = await client.query({
        text: `update usuarios set nombre=$2, balance=$3 where id=$1`,
        values: [id, nombre, balance]
    })
    client.release()
    return rows
}

async function deleteUsuario(id) {
    const client = await pool.connect()
    const res = await client.query(
        "delete from usuarios where id=$1",
        [id]
    )
    client.release()
}

async function addTransfer(emisor, receptor, monto){
    const client = await pool.connect()
    await client.query(
        'insert into transferencias (emisor, receptor, monto) values ($1, $2, $3) returning*',
        [emisor, receptor, monto]
    )
}

module.exports = {insertar, getUsuarios, editUsuarios, deleteUsuario, addTransfer}