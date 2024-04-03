import {Router} from 'express'
import * as usersCtrl  from '../controllers/users.controller'



const router = Router()

router.post('/', usersCtrl.createUser)

router.get('/', usersCtrl.getUsers)

router.get('/:_id', usersCtrl.getUserById)

router.put('/:_id', usersCtrl.updateUserById)

router.delete('/:_id', usersCtrl.deleteUserById)


export default router;