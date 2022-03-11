const express = require('express')
const {insertar, getUsuarios} = require('./db.js')
const app = express()
app.use(express.static('static'))

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

app.get('/usuarios', async (req, res) => {
    try{
        const usuarios = await getUsuarios();
        res.send(usuarios)
    } catch (error){
        return res.status(400).send(error.message)
    }
});


app.get('/transferencias', async (req, res) => {
    res.json([])
})

app.listen(3000, () => console.log('Servidor en puerto 3000'))