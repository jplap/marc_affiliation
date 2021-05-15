var express = require('express');
var router = express.Router();
var request = require('request');
var cors = require ( 'cors' ) ;

var id_controller = require('../controllers/idController');




//advertiser -> Liste les programmes disponibles
router.options('/fetch', cors() );
router.get('/fetch', id_controller.fetch );


router.options('/add', cors() );
router.post('/add',  id_controller.add );

router.options('/delete/:id', cors() );
router.get('/delete/:id', id_controller.delete );



router.options('/setStatus/:id/:status', cors() );
router.post('/setStatus/id/:status', id_controller.setStatus );


router.options('/action ', cors() );
router.post('/action', id_controller.action );



module.exports = router;
