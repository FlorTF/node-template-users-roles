import { Role } from "../models/Role";

export const createRoles = async () => {
  try {
    const count = await Role.count();
    if (count > 0) return;

    const values = await Promise.all([
      new Role({ role: "unprivileged_user" }).save(),
      new Role({ role: "admin" }).save()
    ]);
  } catch (error) {
    console.error(error)
  }
};
