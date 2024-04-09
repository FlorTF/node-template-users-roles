import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import { Role } from "../models/Role";
import { User } from "../models/User";

export const verifyToken = async (req, res, next) => {
  /*Verifica si existe un token en el header. Sin un token en el header no continua con la ejecucion del siguiente middleware.Recordar que los token son creados en la funcion singUp y signIn */
  try {
    const token =
      req.headers[
        "x-access-token"
      ]; /*Recibimos un token*/ /* Al hacer la peticion 'post', const 'token' captura el valor de 'x-access-token'. El token de acceso se espera que esté presente en el header de la solicitud con el nombre "x-access-token".   */
    //console.log(token)

    if (!token)
      return res.status(403).json({
        message: "No token provided",
      }); /*Comprobamos que el token exista */

    const decoded = jwt.verify(
      token,
      TOKEN_SECRET
    ); /*Extraemos la informacion dentro del 'token' y lo guardamos en 'decoded' que es un objeto con los siguientes datos: {_id: a, iat:b, exp:c}  */
    //console.log(decoded);
    req.userId = decoded._id; //_id del usuario que tiene habilitados las funciones CRUD, extraido del token, lo guardamos en una nueva const llamada 'userId' el cual será parte del 'request', esto con la finalidad de usarlo en el siguiente middleware.
    //console.log(req)

    /*A partir del '_id' extraido confirmaremos si el usuario (al que pertenece el token y puede crear otros usuarios) existe o no*/
    const user = await User.findByPk(req.userId, {
      password: 0,
    }); /* Busca un registro en la tabla de usuarios (representada por el modelo User) utilizando el identificador único req.userId, y excluye el campo de la contraseña del resultado.*/

    //console.log(user)
    if (!user) return res.status(404).json({ message: "no user found" });
  } catch (e) {
    return res.status(401).json({ message: "unauthorized" });
  }

  next(); /*Para pasar el control al siguiente middleware en la pila de middleware que se encuentra en user.routes.js.*/
};

export const isAdmin = async (req, res, next) => {
  //console.log(req)

  const user = await User.findByPk( /*findByPk: Nos devuelve un registro de la tabla (en forma de objeto) */
    req.userId
  ); /*'userId' contiene el '_id' del usuario decodificado en el token y este se encuentra en el request. Buscaremos si existe o no (en la tabla de usuarios) este usuario mediante su 'req.userId'. En caso exista guardaremos registro en forma de objeto en la const 'user'. */
  //console.log(user);

  const roles = await Role.findAll({ where: { _id: user.RoleId } }); /*findAll: Nos devuelve uno o más de 1 registro de la tabla (en forma de arreglo de objetos)  */
  /*De la tabla de roles, busca aquellos en el que _id del rol sea igual al que contiene el nuevo objeto'user' */

  //console.log(roles);
  for( let i=0; i< roles.length; i++){ /*roles es un arreglo de objetos(estos objetos son los roles que estan asociados a 'user') */
    if(roles[i].role === 'admin'){ /*Al recorrer el arreglo roles, estamos recorriendo cada objeto, del cual tomaremos la propiedad 'role' y validaremos si el contenido es 'admin' */
      next()
      return
    }
    
  }


  return res.status(403).json({
    message: 'Required admin role'
  })
};
