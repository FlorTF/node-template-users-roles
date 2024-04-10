import { ROLES } from "../models/Role"; /*Importamos el arreglo 'ROLES' desde 'Role.js' o tambien podriamos hacer una consulta a la base de datos, pero como son solo dos registros, crearemos el arreglo */
import {User} from "../models/User"



export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const user = await User.findOne({where: {username: req.body.username}})

  if(user) return res.status(400).json({message: 'The user already exists'})

  const email = await User.findOne({where: {email: req.body.email}})

  if(email) return res.status(400).json({message: 'The email already exists'})

  next();
}

export const checkRolesExisted = (req, res, next) => { /*Verifica si el rol que esta creando el usuario, existe.*/ /* 'roles' es un arreglo que contiene los roles con el cual se estan ingresando los datos en el requestbody  */
//console.log(req.body)
  
    //if (!req.body.roles) return res.status(400).json({ message: "No roles" });
  if(req.body.roles){
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} does not exist`,
        });
      }
    }
  }
    
     
  
  next();
};
