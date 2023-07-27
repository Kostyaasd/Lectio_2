import { Router } from "express";
const router = new Router()
import userController from '../controller/controller.js'


router.post('/register',userController.createUser)
router.post('/login',userController.logUser)
router.get('/user',userController.getUser)


export default router