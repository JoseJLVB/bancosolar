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

async function addTransfer(transEmisor, transReceptor, monto, fecha) {

    const client = await pool.connect();
    let { rows } = await client.query({
        text: 'select * from usuarios where nombre=$1',
        values: [transEmisor]
    });
    const emisor = rows[0];

    const transfer = await client.query({
        text: 'select * from usuarios where nombre=$1',
        values: [transReceptor]
    });
    const receptor = transfer.rows[0];

    const transMonto = parseInt(monto);

    if (emisor.balance < transMonto) {
        throw "No tiene saldo suficiente para realizar la transferencia";
    }

    const montoEmisor = emisor.balance - transMonto;
    await client.query({
        text: 'update usuarios set balance=$1 where id=$2',
        values: [montoEmisor, emisor.id]
    });

    const montoReceptor = receptor.balance + transMonto;
    await client.query({
        text: 'update usuarios set balance=$1 where id=$2',
        values: [montoReceptor, receptor.id]
    });
    
    await client.query({
        text: "insert into transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, $4)",
        values: [emisor.id, receptor.id, transMonto, new Date(Date.now())]
    });

    client.release();
    return transfer.rows;
}

async function getTransfer() {
    const client = await pool.connect()
    const res = await client.query({
        text: `select transfer.id, transfer.emisor, usuarios.nombre as receptor, transfer.monto, 
        transfer.fecha from (select transferencias.fecha, usuarios.nombre as emisor, 
        transferencias.receptor, transferencias.monto, transferencias.id 
        from transferencias join usuarios on usuarios.id = transferencias.emisor) 
        as transfer join usuarios on usuarios.id = transfer.receptor`,
        rowMode: 'array'
    })
    client.release()
    return res.rows
}
module.exports = {insertar, getUsuarios, editUsuarios, deleteUsuario, addTransfer, getTransfer}