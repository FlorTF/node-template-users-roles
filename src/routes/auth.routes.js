import {Router} from 'express'
import * as authCtrl  from '../controllers/auth.controller'

const router = Router()

router.post('/signUp', authCtrl.singUp )
router.post('/signIn', authCtrl.singIn)


export default router;