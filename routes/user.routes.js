const userController = require('../controllers/user.controller')

const express = require('express');
const router = express.Router();
let jwt = require('../utils/jwtAuth');


/**
 * @swagger
 * definitions:
 *  User:
 *   type: object
 *   properties:
 *    firstName:
 *     type: string
 *     description: first name of the employee
 *     example: 'daniel'
 *    lastNameName:
 *     type: string
 *     description: last name of the employee
 *     example: 'christian'
 *    userType:
 *     type: int    
 *     description: type of the employee
 *     example: 'OWNERS'
 *    userId:
 *     type: string
 *     description: Id of the employee
 *     example: 0
 *  UserReq:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: Email of the employee
 *     example: 'daniel@demo.com'
 *    password:
 *     type: string
 *     description: password of the employee
 *     example: 'Danirl@1e'
 *  otp:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: Email of the employee
 *     example: 'daniel@demo.com'
 *  verifyotp:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'daniel@demo.com'
 *    OTP:
 *     type: string
 *     description: OTP
 *     example: 123456
 *  unlock-user:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'daniel@demo.com'
 */


/**
 * @swagger
 * /login:
 *  post:
 *   summary: login user
 *   description: login user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/UserReq'
 *   responses:
 *    200:
 *     description: login successfully
 *    500:
 *     description: something went wrong
 */


router.post('/login', userController.login);

/**
 * @swagger
 * /sendotp:
 *  post:
 *   summary: send otp
 *   description: login user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/otp'
 *   responses:
 *    200:
 *     description: otp sent successfully
 *    500:
 *     description: something went wrong
 */

router.post('/sendotp', userController.sendOTP);


/**
 * @swagger
 * /verifyotp:
 *  post:
 *   summary: verify otp
 *   description: verify otp
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/verifyotp'
 *   responses:
 *    200:
 *     description: otp sent successfully
 *    500:
 *     description: something went wrong
 */

router.post('/verifyotp', userController.verifyOTP);


/**
 * @swagger
 * /unlock-user:
 *  post:
 *   summary: unlock user
 *   description: unlock user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/unlock-user'
 *   responses:
 *    200:
 *     description: user unlock successfully
 *    500:
 *     description: something went wrong
 */

router.post('/unlock-user', userController.unlockUser);

/**
 * @swagger
 * /reset-password:
 *  post:
 *   summary: Reset password
 *   description: This api will reset the user password 
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/unlock-user'
 *   responses:
 *    200:
 *     description: password reset successfully
 *    500:
 *     description: something went wrong
 */

 router.post('/reset-password', userController.resetPassword);


module.exports = router;


