// Requires 
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar Variables 
const app = express();

// Body parser 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Importar Rutas 
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');




// Conexión a la base de datos 
mongoose.connect('mongodb://localhost/hospitalDB',
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, res) => {

        if (err) throw err;

        console.log('\x1b[32m Base de datos: \x1b[4m\x1b[31m%s\x1b[0m', 'Online');
    });

// Rutas 
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);




// Escuchar Peticiones 
app.listen(3000, () => {
    console.log('\x1b[32m Express server listening in port: \x1b[4m\x1b[31m%s\x1b[0m', '3000');

});