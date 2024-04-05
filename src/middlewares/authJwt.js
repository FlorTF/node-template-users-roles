import jwt from "jsonwebtoken"
import {TOKEN_SECRET} from "../config"
import {User} from '../models/User'


export const verifyToken = async (req, res, next) => { /*Verifica si existe un token en el header. Sin un token en el header no continua con la ejecucion del siguiente middleware.Recordar que los token son creados en la funcion singUp y signIn */
    try{
        const token = req.headers["x-access-token"] /*Recibimos un token*/ /* Al hacer la peticion 'post', const 'token' captura el valor de 'x-access-token'. El token de acceso se espera que esté presente en el header de la solicitud con el nombre "x-access-token".   */
    //console.log(token)

    if(!token) return res.status(403).json({message: "No token provided"}) /*Comprobamos que el token exista */

    const decoded = jwt.verify(token, TOKEN_SECRET) /*Extraemos la informacion dentro del 'token' y lo guardamos en 'decoded' que es un objeto con los siguientes datos: {_id: a, iat:b, exp:c}  */
    console.log(decoded)
    req.userId = decoded._id //_id del usuario que tiene habilitados las funciones CRUD, extraido del token
    

    /*A partir del '_id' extraido confirmaremos si el usuario (al que pertenece el token y puede crear otros usuarios) existe o no*/
    const user = await User.findByPk(req.userId, {password: 0})
    //console.log(user)
    if (!user) return res.status(404).json({message: 'no user found'})

    }catch(e){
        return res.status(401).json({message: 'unauthorized'})
    }

    next() /*Para pasar el control al siguiente middleware en la pila de middleware que se encuentra en user.routes.js.*/
}