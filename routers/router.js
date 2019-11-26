const controller = require('../controllers/controllers');

const express = require('express');
const router = express.Router();

router.post('/confirmation/:id', controller.confirmationPost);
router.post('/resendVerifyEmail', controller.resendTokenPost);

router.post('/register', controller.register);
router.post('/login', controller.login);

router.post('/forgotPassword', controller.forgotPassword);
router.post('/resetPassword/:id', controller.resetPassword);
router.post('/updatePasswordViaEmail', controller.updatePasswordViaEmail);

router.get('/dashboard/persons', controller.getAllPersons);
router.get('/dashboard/chips', controller.getAllChips);
router.post('/dashboard/editPerson', controller.editPersonsData);

module.exports = router;
