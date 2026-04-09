import express from "express";
import { env } from "../config/env";
import { appRouter } from "./routes";
import { errorHandlerMiddleware } from "../middlewares/errorHandler";


const app = express();

app.use(express.json());
app.use(appRouter);
app.use(errorHandlerMiddleware);

app.listen(env.PORT, env.HOST, () => {
    console.log(`Server started on: http://${env.HOST}:${env.PORT}`);
});
