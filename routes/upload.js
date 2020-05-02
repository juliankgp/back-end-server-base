var express = require('express');
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');

var app = express();
app.use(fileUpload());

var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');


app.put('/:tipo/:id', (req, res, next) => {

    var tipoColec = req.params.tipo;
    var id = req.params.id;

    var tiposColecciones = ['usuarios', 'medicos', 'hospitales'];

    if (tiposColecciones.indexOf(tipoColec) < 0) {
        return res.status(400).json({
            success: false,
            message: 'Tipo de coleccion invalido.',
            errors: { message: 'La colección ' + tipoColec + ' no existe' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al seleccionar la imagen.',
            errors: {
                message: 'Debe seleccionar una imagen'
            }
        });
    }

    buscarId(tipoColec, id).then(resp => {

        if (!resp) {
            return res.status(400).json({
                success: false,
                message: 'Error al traer la data',
                errors: { message: 'No hay data disponible' }
            });
        }

        var data = resp;

        // Obtener nombre del archivo
        var archivo = req.files.imagen;
        var nombreCortado = archivo.name.split('.');
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // Sólo estas extensiones aceptamos
        var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

        if (extensionesValidas.indexOf(extensionArchivo) < 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Extension no válida',
                errors: {
                    message: 'Las extensiones válidas son ' + extensionesValidas.join(', ')
                }
            });
        }

        // Nombre de archivo personalizado
        // 12312312312-123.png
        var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

        // Mover el archivo del temporal a un path
        var path = `./uploads/${tipoColec}/${nombreArchivo}`;

        archivo.mv(path, err => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',
                    errors: err
                });
            }

        });

        var pathViejo = `./uploads/${tipoColec}/${data.img}`;

        // Si existe, elimina la imagen anterior
        if (fileSystem.existsSync(pathViejo)) {
            fileSystem.unlinkSync(pathViejo);
        }

        data.img = nombreArchivo;

        data.save((err, dataActualizada) => {

            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al guardar ' + tipoColec,
                    errors: err
                });

            }

            dataActualizada.password = '';

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de usuario actualizada',
                dataActualizada
            });
        });


    }).catch(err => {
        return res.status(400).json({
            success: false,
            message: 'Error en la ejecución de la promesa.',
            errors: err.error
        });

    });

});

function buscarId(tipoColec, id) {
    var Schema;

    var respuesta = {
        error: null,
    };

    var coleccion = tipoColec;

    switch (coleccion) {
        case 'usuarios':
            Schema = Usuario;
            break;
        case 'medicos':
            Schema = Medico;
            break;
        case 'hospitales':
            Schema = Hospital;
            break;

    }

    return new Promise((resolve, reject) => {

        Schema.findById(id, (err, resp) => {

            if (err) {
                respuesta.error = err;
                reject(respuesta);
            }

            if (!resp) {
                respuesta.error = `El id: ${id} no existe en la colección ${tipoColec}`;
                reject(respuesta);
            }

            resolve(resp);

        });

    });

}




module.exports = app;