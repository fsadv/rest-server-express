const { Router } = require('express');
const { check } = require('express-validator');
const { postCategoria, getCategorias, getCategoria, putCategoria, deleteCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId, esRolValido } = require('../helpers/db-validators');
const { validarJWT, tieneRol, esAdminRol } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();



//Obtener todas las categorias
router.get('/', getCategorias);


router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], getCategoria)

//Crear categoria - Con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCategoria);


//Actualizar por ID
router.put('/:id',[
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], putCategoria);

//Borrar por ID - Solo ADMIN
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] , deleteCategoria);


module.exports = router;