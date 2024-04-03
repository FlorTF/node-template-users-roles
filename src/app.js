import express from "express";
import morgan from "morgan";
import usersRoutes from './routes/users.routes'

const app = express();

app.use(express.json())
app.use(morgan("dev"));

app.use('/users', usersRoutes)


export default app;
