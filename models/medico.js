var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');


var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    documento: { type: Number, unique: true, required: [true, 'El documento de identidad es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El id del usuario es un campo obligatorio'] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
},
    { timestamps: true });

medicoSchema.plugin(uniqueValidator, { message: 'El medico con {PATH} {VALUE} ya se encuentra registrado.' });

module.exports = mongoose.model('Medico', medicoSchema);