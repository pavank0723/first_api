import express from "express";
import { registerController, loginController,userController } from "../controllers";
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

router.get('/me',auth,userController.me)

export default router