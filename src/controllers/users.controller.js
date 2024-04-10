import { User } from "../models/User";
import { Role } from "../models/Role";
import bcrypt from "bcryptjs"; /*Encriptar contraseñas */
import { createAccessToken } from "../libs/jwt.js";

export const createUser = async (req, res) => {
  const { username, email, password, roles } = req.body;
  try {
    const foundRoles = await Role.findAll({ where: { role: roles } });
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      RoleId: foundRoles.map((r) => r._id),
      
    });
    
    
    const userSaved = await newUser.save();
    console.log(userSaved)
    

    //res.json(newUser);
    const token = await createAccessToken({ _id: userSaved._id });
    res.cookie("token", token);

    res.json({
      _id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      RoleId: userSaved.roles,
      token: token,

     
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["_id", "username", "email", "password" /*, "RoleId"*/],
      order: [["_id", "DESC"]],
      //where: {RoleId: req.Role._id}
    });
    res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { _id } = req.params;

  try {
    const user = await User.findOne({
      where: { _id },
      attributes: ["_id", "username", "email", "password", "RoleId"],
    });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserById = async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ["_id", "username", "email", "password"],
      where: { _id },
    });

    user.set(req.body);

    await user.save();

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  const { _id } = req.params;
  try {
    await User.destroy({
      where: { _id },
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
