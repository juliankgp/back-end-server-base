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
var usuarioRoutes = require('./routes/usuarios/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospitales/hospital');
var medicoRoutes = require('./routes/medicos/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');




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

    // No sera utilizado en esta caso pero se deja el registro de como hacerlo 
// Server index config 
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas 
// Usuarios 
app.use('/usuario', usuarioRoutes);
// Hospitales 
app.use('/hospital', hospitalRoutes);
// Medicos 
app.use('/medico', medicoRoutes);
// Login 
app.use('/login', loginRoutes);
// Busqueda 
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);




// Escuchar Peticiones 
app.listen(3000, () => {
    console.log('\x1b[32m Express server listening in port: \x1b[31m%s\x1b[0m', '3000 \x1b[32m Process id: ', process.pid);

});