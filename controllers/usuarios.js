const { response, request } = require('express');




const usuariosGet = (req = request,res = response) => {

    const { q, nombre = 'Sin nombre', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

const usuariosPut = (req,res = response) => {

    const { id } = req.params.id;

    res.json({
        msg: 'put API - Controlador',
        id
    });
};

const usuariosPost = (req,res = response) => {

    const {nombre, edad} = req.body;

    res.json({
        msg: 'post API - Controlador',
        nombre,
        edad
    });
};

const usuariosDelete = (req,res = response) => {
    res.json({
        msg: 'delete API - Controlador'
    });
};

const usuariosPath = (req,res = response) => {
    res.json({
        msg: 'patch API - Controlado'
    });
};



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosDelete,
    usuariosPath,
    usuariosPost
}