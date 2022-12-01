import express from "express";
import { registerController, loginController,userController, refreshController,productController } from "../controllers";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin"

const router = express.Router()

router.post('/auth/register',[auth,admin],registerController.register)

router.post('/auth/login',loginController.login)

router.get('/auth/user',auth,userController.me)

router.post('/auth/refresh',refreshController.refresh)

router.post('/auth/logout',auth,loginController.logout)

router.post('/comp/create/product',[auth,admin],productController.store)

router.put('/comp/update/product/:id',[auth,admin],productController.update)

router.delete('/comp/delete/product/:id',[auth,admin],productController.destroy)

router.get('/comp/view/products',productController.index)

router.get('/comp/view/product/:id',productController.show)

export default router