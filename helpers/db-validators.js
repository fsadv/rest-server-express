const {Usuario, Categoria, Rol, Producto} = require('../models/');

const esRolValido = async(rol = '') => {
    const existeRol = await Rol.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExiste = async(correo='') => {
const existeMail = await Usuario.findOne({ correo });
if(existeMail) {
    throw new Error(`El correo: ${correo} ya está registrado.`);
 }
} 

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario) {
        throw new Error(`El ID: ${id} no existe.`);
     }
    }
    
const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria) {
        throw new Error(`El ID: ${id} no existe`);
    } 
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto) {
        throw new Error(`El ID ${id} no existe`);
    }
}



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}