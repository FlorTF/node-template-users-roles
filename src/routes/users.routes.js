import {Router} from 'express'
import * as usersCtrl  from '../controllers/users.controller'
import {verifyToken} from '../middlewares'


const router = Router()

router.post('/', verifyToken ,usersCtrl.createUser)

router.get('/', verifyToken, usersCtrl.getUsers)

router.get('/:_id', verifyToken, usersCtrl.getUserById)

router.put('/:_id', verifyToken, usersCtrl.updateUserById)

router.delete('/:_id', verifyToken, usersCtrl.deleteUserById)


export default router;