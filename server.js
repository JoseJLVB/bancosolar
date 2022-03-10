const express = require('express')
const {insertar} = require('./db.js')
const app = express()
app.use(express.static('static'))

app.get('/usuarios', async (req, res) => {
    res.json([])
})

app.get('/transferencias', async (req, res) => {
    res.json([])
})

app.post('/usuario', async (req,res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    });

    req.on("end", async () => {
        const datos = JSON.parse(body);
        console.log(datos);
        await insertar(datos.nombre, datos.balance)
        
        res.json({datos});
        
    })
})

app.listen(3000, () => console.log('Servidor en puerto 3000'))