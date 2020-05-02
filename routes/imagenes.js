var express = require('express');

var app = express();

const path = require('path');
const fileSystem = require('fs');



app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fileSystem.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/img/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});


module.exports = app;