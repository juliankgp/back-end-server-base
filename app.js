// Requires 
const express = require('express');
const mongoose = require('mongoose');


// Inicializar Variables 
const app = express();

// Conexión a la base de datos 
mongoose.connect('mongodb://localhost/hospitalDB',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, res) => {

        if (err) throw err;

        console.log('\x1b[32m Base de datos: \x1b[4m\x1b[31m%s\x1b[0m', 'Online');
    });


// Rutas 
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente.'
    });

});

// Escuchar Peticiones 
app.listen(3000, () => {
    console.log('\x1b[32m Express server listening in port: \x1b[4m\x1b[31m%s\x1b[0m', '3000');

});