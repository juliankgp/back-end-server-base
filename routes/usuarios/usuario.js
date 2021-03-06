var express = require('express');
var bcrypt = require('bcryptjs'); //Encriptacion de contraseñas

var mdAutenticacion = require('../../middlewares/autenticacion'); //Middlewares


var app = express();

var Usuario = require('../../models/usuario');


// =====================================================
// Obtener todos los usuarios
// =====================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;

    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios.',
                        error: err
                    });
                }
                
                Usuario.countDocuments({}, (err, conteo) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al contar usuarios.',
                            error: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        usuarios,
                        total: conteo
                    });
                });

            });

});




// =====================================================
// Crear nuevo usuario 
// =====================================================
app.post('/',  (req, res) => {

    var body = req.body;
    if (body.role) {
        body.role = body.role.toUpperCase();
    }


    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role

    });


    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario.',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });


    });


});

// =====================================================
// Actualizar usuario 
// =====================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {

        var body = req.body;

        if (!usuario) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: {
                    message: 'No existe usuario con este ID',
                    error: err
                }
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario.',
                errors: err
            });
        }


        if (usuario) {

            usuario.nombre = body.nombre;
            usuario.apellido = body.apellido;
            usuario.email = body.email;
            usuario.role = body.role.toUpperCase();

            usuario.save((err, usuarioGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }

                usuarioGuardado.password = '';
                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado
                });

            });
        }
    });


});

// =====================================================
// Eliminar Usuario 
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con el id: ' + id,
                errors: { message: 'El ID no corresponde a ningun usuario.' }
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario.',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            message: 'El usuario ha sido eliminado',
            usuario: usuarioBorrado
        });


    });



});



module.exports = app;