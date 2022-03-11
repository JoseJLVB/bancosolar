const express = require('express')
const {insertar, getUsuarios, editUsuarios} = require('./db.js')
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

app.put('/usuario', async (req, res) => {
    let body = ""

    req.on('data', (data) => {
        body += data
    })

    req.on('end', async () => {
        const datos = Object.values(JSON.parse(body));
        try{
            await editUsuarios(req.query.id, datos[0], datos[1])
        } catch (error){
            return res.send(error.message)
        }
        res.send('usuario modificado')
    })
});

app.get('/transferencias', async (req, res) => {
    res.json([])
})

app.listen(3000, () => console.log('Servidor en puerto 3000'))