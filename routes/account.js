var express = require('express');
var router = express.Router();
var accountController =  require('../controllers/accountController');

router.post('/login', accountController.login);
router.post('/signup', accountController.signup);
router.get('/whoami', accountController.whoami);
router.get('/logout', accountController.logout);
router.put('/changepassword', accountController.changePassword);

module.exports = router;

