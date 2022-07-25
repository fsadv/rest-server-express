const {response} = require('express');
const {Categoria} = require('../models');



 
const getCategorias = async(req = request,res = response) => {

    //const { q, nombre = 'Sin nombre', apikey, page = 1, limit } = req.query;
    const { limit = 5, desde = 0 } = req.query;    

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true}) //se puede pasar en parametros la condicion. ej {estado = true}
        .populate('usuario', 'nombre')
        .skip(desde)
        .limit(limit)
    ]);

    res.status(200).json({
        total,
        categorias
    });
};



const getCategoria = async(req, res=response) => {

    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.status(200).json({
        categoria
    });


}



const putCategoria = async (req ,res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true})
                        .populate('usuario', 'nombre');
    
    res.status(200).json({    
        categoria
    });
};

const deleteCategoria = async(req, res=response) => {

    const { id } = req.params;

        
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true});
    const usuarioAutenticado = req.usuario;

    res.status(200).json({categoria, usuarioAutenticado});

}

const postCategoria = async(req, res = response) => {
   
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria);

};




module.exports = {
    postCategoria,
    getCategorias,
    getCategoria,
    putCategoria,
    deleteCategoria    
}