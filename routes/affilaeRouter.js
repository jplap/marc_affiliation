var express = require('express');
var router = express.Router();

var cors = require ( 'cors' ) ;


var affilaeController = require('../controllers/affilaeController');

//advertiser -> Liste les programmes disponibles

router.options('/advertiser', cors() );
router.get('/advertiser', affilaeController.advertiser );



module.exports = router;
