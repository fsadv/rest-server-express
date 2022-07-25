const { Router } = require('express');
const { check } = require('express-validator');
const { postProducto, getProducto, getProductos, putProducto, deleteProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRol } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();



//Obtener todas las categorias
router.get('/', getProductos);


router.get('/:id',[
    check('id', 'No es un ID de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos    
], getProducto)

//Crear categoria - Con token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
] ,postProducto);


//Actualizar por ID
router.put('/:id',[
    validarJWT,
    check('categoria', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,putProducto);

//Borrar por ID - Solo ADMIN
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,deleteProducto);


module.exports = router;