const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');




const usuariosGet = async(req = request,res = response) => {

    //const { q, nombre = 'Sin nombre', apikey, page = 1, limit } = req.query;
    const { limit = 5, desde = 0 } = req.query;    

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(),
        Usuario.find() //se puede pasar en parametros la condicion. ej {estado = true}
        .skip(desde)
        .limit(limit)
    ]);

    res.json({
        total,
        usuarios
    });
};

const usuariosPut = async (req ,res = response) => {

    const { id } = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    if(password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({    
        usuario
    });
};

const usuariosPost = async (req,res = response) => {



    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
 

    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();

    res.json({       
        usuario
    });
};

const usuariosDelete = async(req,res = response) => {

    const { id } = req.params;

    //Borrado físico
    const usuario = await Usuario.findByIdAndDelete(id);

    //Borrado logico

    /*
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false})
    */

    res.json({
        id,
        borrado:usuario
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