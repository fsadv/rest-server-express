const Rol = require('../models/rol');
const Usuario = require('../models/usuario');

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



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}