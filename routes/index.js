var express = require('express');
var router = express.Router();
const index_ontroller = require("../controllers/indexController");

//router
router.get('/', index_ontroller.index);
router.get('/index', index_ontroller.index);
router.get('/login', index_ontroller.login_get)
router.get('/login_failed', index_ontroller.login_get_failed)
router.post('/login', index_ontroller.login_post)
router.get('/sign_up', index_ontroller.sign_up_get)
router.post('/sign_up', index_ontroller.sign_up_post)
router.get('/logout', index_ontroller.logout)
router.get('/chat', index_ontroller.chat)
router.post('/chat', index_ontroller.chat_post)

module.exports = router;
