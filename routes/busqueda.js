var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// =====================================================
// Busqueda especifica
// =====================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;

    var busqueda = req.params.busqueda;
    var regex = RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;

        default:
            if (tabla) {

                return res.status(404).json({
                    ok: false,
                    mensaje: 'No se encontro una coleccion con ese nombre',
                    err: { message: 'Tipo de tabla/colección no válido !!!' }
                });
            }

            break;

    }

    promesa.then(respuesta => {
        res.status(200).json({
            ok: true,
            [tabla]: respuesta,
        });
    }).catch(err => {
        console.log('Error en la busqueda ', err);
    });


});


// =====================================================
// Busqueda General 
// =====================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });

    }).catch(err => {
        console.log('Ocurrio un error', err);
    });

});

function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex }, (err, hospitales) => {

            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales);
            }

        }).populate('usuario', 'nombre email');
    });
}

function buscarMedicos(regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex }, (err, medicos) => {

            if (err) {
                reject('Error al cargar medicos', err);
            } else {
                resolve(medicos);
            }

        })
            .populate('usuario', 'nombre email')
            .populate('hospital');
    });
}

function buscarUsuarios(regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });

}

module.exports = app;