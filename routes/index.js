import express from "express";
import { registerController, loginController,userController, refreshController } from "../controllers";
import auth from "../middlewares/auth";

const router = express.Router()

/**
 * @swagger
 * /register:
 * post:
 *      description: Use to register a user
 *      responses:
 *        200:
 *          description: A successfull response
 *          content:
 *              application/json:
 */
router.post('/auth/register',registerController.register)

/**
 * @swagger
 * /login:
 * post:
 *  description: Use to register a user
 */
router.post('/auth/login',loginController.login)

/**
 * @swagger
 * /user:
 * get:
 *  description: view the verify user
 */
router.get('/auth/user',auth,userController.me)

router.post('/auth/refresh',refreshController.refresh)

router.post('/auth/logout',auth,loginController.logout)

export default router