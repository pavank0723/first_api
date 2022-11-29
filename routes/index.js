import express from "express";
import { registerController, loginController } from "../controllers";

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

export default router