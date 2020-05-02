var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var Medico = require('../../models/medico');

// =====================================================
// Get: Obtener todos los registros
// =====================================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;

    desde = Number(desde);

    Medico.find({}, (err, medicos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando medicos.',
                error: err
            });
        }

        Medico.countDocuments({}, (err, conteo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error contando medicos.',
                    error: err
                });
            }

            res.status(200).json({
                ok: true,
                medicos,
                total: conteo
            });
        });

    })
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5);

});

// =====================================================
// POST: Crear registro
// =====================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        apellido: body.apellido,
        documento: body.documento,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el registro del medico.',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
        });

    });

});

// =====================================================
// PUT:Actualizar
// =====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findById(id, (err, medico) => {

        var body = req.body;

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe.',
                errors: err
            });
        }

        if (!medico) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el medico.',
                errors: err
            });
        }

        medico.nombre = body.nombre;
        medico.apellido = body.apellido;
        medico.documento = body.documento;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });

    });

});

// =====================================================
// Eliminar Usuario 
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medicoEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico.',
                errors: err
            });
        }

        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id: ' + id + ' no existe.',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            // message: medicoEliminado.nombre + ' ' + medicoEliminado.apellido + ' ha sido eliminado con exito',
            message: `El medico ${medicoEliminado.nombre} ${medicoEliminado.apellido}  ha sido eliminado con exito`,
            medico: medicoEliminado
        });
    });

});


module.exports = app;