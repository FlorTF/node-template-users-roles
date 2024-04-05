import { User } from "../models/User";
import { Role } from "../models/Role";
import { Sequelize } from "sequelize";
import bcrypt from "bcryptjs"; /*Encriptar contraseñas */
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const singUp = async (req, res) => {
  const { username, email, password, roles } = req.body;
  try {
    /*Se encripta la contraseña */
    const passwordHash = await bcrypt.hash(password, 10);

    /*Se crea un usuario */
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      
    });

    if (roles) {
      const foundRoles = await Role.findAll({ where: { role: roles } }); /*Busca en la columna 'role' de la tabla Role todos los registros que tienen el valor ingresado en roles*/
      newUser.RoleId = foundRoles.map((r) => r._id);/*foundRoles es el registro completo(en forma de objeto), recorremos cada registro y tomamos el .id, para ingresarlo en el valor 'roles' de newUser */
    } else { /*Si no se ingresó ningun valor en req.body.roles */
      const roleUnprivilegedUser = await Role.findOne({ /*Busca en la columna 'role' de la tabla Role solo un registro que tiene que tiene como contenido*/ /*roleUnprivilegedUser es el registro completo(en forma de objeto) */
        where: { role: "unprivileged_user" },
      });
      newUser.RoleId = [roleUnprivilegedUser._id]; /*Por defecto se tomará el id del registro 'unprivileged_user' para ingresarlo en el valor 'roles' de newUser */
    }

    /*Se guarda un usuario */
    const userSaved = await newUser.save();
    console.log({userSaved});

    /*Se crea el token */
    const token = await createAccessToken({ _id: userSaved._id });

    res.cookie("token", token); /*el token se guarda en el valor de la cookie */

    res.json({
      _id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      RoleId: userSaved.RoleId,

      //   //token: token
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const singIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({
      where: { email },
    }); /*usuario buscado por el email */
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(
      password,
      userFound.password
    ); /*Compara la contraseña del input y la de la bd */

    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    /*Se crea el token */
    const token = await createAccessToken({ _id: userFound._id });

    res.cookie("token", token); /*el token se guarda en el valor de la cookie */
    // res.json({
    //     message: "Usuario creado satisfactoriamente",
    // })
    console.log(userFound)
    res.json({
      _id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
