import {User} from '../models/User'
import {Role} from '../models/Role'
import bcrypt from 'bcryptjs'; /*Encriptar contraseñas */
import { createAccessToken } from '../libs/jwt.js'
import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config.js'

export const singUp = async (req, res) => {
   
    const {username, email, password} = req.body
    try{
        /*Se encripta la contraseña */
        const passwordHash = await bcrypt.hash(password, 10) 

        /*Se crea un usuario */
        const newUser = new User({ 
            username, 
            email, 
            password: passwordHash,
        })



        /*Se guarda un usuario */
        const userSaved = await newUser.save();

        /*Se crea el token */
        const token = await createAccessToken ({_id: userSaved._id})
       
            res.cookie('token', token) /*el token se guarda en el valor de la cookie */
            // res.json({
            //     message: "Usuario creado satisfactoriamente",
            // })
            res.json({
                _id: userSaved._id,
                username: userSaved.username,
                email: userSaved.email,
                createdAt: userSaved.createdAt,
                updatedAt: userSaved.updatedAt,
                //token: token
            
            })
            
    }catch(e){
        res.status(500).json({message: e.message})
    }


}

export const singIn = async (req, res) => {
    const {email, password} = req.body
    try{

        const userFound = await User.findOne({where: {email}})/*usuario buscado por el email */
        if(!userFound) return res.status(400).json({message: "Usuario no encontrado"})

        const isMatch = await bcrypt.compare(password, userFound.password) /*Compara la contraseña del input y la de la bd */

        if (!isMatch) return res.status(400).json({message: "Contraseña incorrecta"})

        /*Se crea el token */
        const token = await createAccessToken ({_id: userFound._id}) 
       
            res.cookie('token', token); /*el token se guarda en el valor de la cookie */
            // res.json({
            //     message: "Usuario creado satisfactoriamente",
            // })
            res.json({
                _id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt,
            })
    }catch(e){
        res.status(500).json({message: e.message})
    }
}


