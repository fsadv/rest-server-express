const {Router} = require('express');
const { check } = require('express-validator');


const {validarCampos, validarJWT, esAdminRol, tieneRol } = require('../middlewares/');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPath } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
] ,usuariosPut);

router.post('/', [    
    check('nombre', 'El nombre no es válido').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 letras').isLength({min:6}),
    //check('rol', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id',[
    validarJWT,
   // esAdminRol,
    tieneRol('ADMIN_ROL', 'VENTAS_ROL'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
] ,usuariosDelete);

router.patch('/', usuariosPath);






module.exports = router;