var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var Hospital = require('../../models/hospital');


// =====================================================
// Get: Obtener todos los registros
// =====================================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, (err, hospitales) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales.',
                error: err
            });
        }

        Hospital.countDocuments({}, (err, conteo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error contando hospitales.',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                hospitales,
                total: conteo,
            });

        });

    })
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5);

});

// =====================================================
// POST: Crear registro
// =====================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({

        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital.',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
        });

    });

});

// =====================================================
// PUT:Actualizar
// =====================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {

        var body = req.body;

        if (!hospital) {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe.',
                    errors: err
                });
            }
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital.',
                errors: err
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        // console.log('req', req);


        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });



    });


});
// =====================================================
// Eliminar Usuario 
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalEliminado) => {


        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe.',
                errors: err
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital.',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            message: hospitalEliminado.nombre + ' ha sido eliminado con exito',
            hospital: hospitalEliminado
        });

    });

});



module.exports = app;