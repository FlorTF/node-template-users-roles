import express from "express";
import morgan from "morgan";

import {createRoles} from './libs/initialSetup'

import usersRoutes from './routes/users.routes'
import authRoutes from './routes/auth.routes'


const app = express();
createRoles();

app.use(express.json())
app.use(morgan("dev"));



app.use('/api/users', usersRoutes)
app.use('/api/auth', authRoutes)



export default app;
