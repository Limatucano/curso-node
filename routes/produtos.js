const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');
const produtos_controller = require('../controllers/produtos-controller')

const storage = multer.diskStorage({
    destination: function (req, file ,cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        let data = new Date().toISOString().replace(/:/g,'-')+'-';
        cb(null, data + file.originalname);
    }

});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
    
}

const upload = multer({
    storage: storage,
    limit: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});

router.get('/', produtos_controller.getProdutos);

router.post('/',login.obrigatorio , upload.single('produto_imagem'), produtos_controller.postPoduto);

router.get('/:id_produto', produtos_controller.getProdutoById);

router.patch('/',login.obrigatorio, upload.single('produto_imagem'), produtos_controller.patchProduto);

router.delete('/:id_produto',login.obrigatorio, produtos_controller.deletePoduto );

module.exports = router;