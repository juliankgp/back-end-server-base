var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');


var hospitalSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
    
}, { collection: 'hospitales',  timestamps: true  });

hospitalSchema.plugin(uniqueValidator, { message: 'El hospital {VALUE} ya se encuentra registrado.' });


module.exports = mongoose.model('Hospital', hospitalSchema);