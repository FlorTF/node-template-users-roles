import { Router } from "express";
const router = Router();

import * as usersCtrl from "../controllers/users.controller";
import { authJwt, verifySignup } from "../middlewares";

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isAdmin, verifySignup.checkRolesExisted, verifySignup.checkDuplicateUsernameOrEmail],
  
  usersCtrl.createUser
); /*Antes de que se pueda ingresar al middleware 'createUser', se debe verificar que exista un token asociado a un usuario y que el rol del usuario asociado sea de Admin */
/*En el middleware verifyToken hemos creado una const userId que obtenemos de decodificar el token del usuario y lo insertamos en el request(datos input de la peticion) . Luego de ello le damos pase al sgte middleware isAdmin, el cual tambien tendrá acceso al request de verifyToken, es decir la const userId tambien funcionaria en isAdmin */

router.get("/", [authJwt.verifyToken, authJwt.isAdmin], usersCtrl.getUsers);

router.get(
  "/:_id",
  [authJwt.verifyToken, authJwt.isAdmin],
  usersCtrl.getUserById
);

router.put(
  "/:_id",
  [authJwt.verifyToken, authJwt.isAdmin],
  usersCtrl.updateUserById
);

router.delete(
  "/:_id",
  [authJwt.verifyToken, authJwt.isAdmin],
  usersCtrl.deleteUserById
);

export default router;
