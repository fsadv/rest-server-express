const {response} = require('express');
const { ObjectId } = require('mongoose').Types;
const { Categoria, Producto, Usuario} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];



const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId) {
        const usuario = await Usuario.findById(termino);
        return  res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{nombre:regex}, {correo:regex}],
        $and: [{estado:true}] 
    });
    
    return  res.json({
        results: usuarios
    })
}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId) {
        const categoria = await Categoria.findById(termino)
                                         .populate('categoria', 'nombre');
        return  res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({       
        $and: [{nombre:regex}, {estado:true}] 
    });
    
    return  res.json({
        results: categorias
    })
}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId) {
        const producto = await Producto.findById(termino)
                                       .populate('categoria', 'nombre');
        return  res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({       
        $and: [{nombre:regex}, {estado:true}] 
    }).populate('categoria', 'nombre');
    
    return  res.json({
        results: productos
    })
}




const buscar = (req, res=response) => {

    const { coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;   
        case 'productos':
            buscarProductos(termino, res);
            break;
        
        default:
            res.status(500).json({
                msg:'Error - No esta la busqueda - Faltó'
            });
    }



}


module.exports = {
    buscar
}