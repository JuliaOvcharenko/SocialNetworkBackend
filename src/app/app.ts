import express from "express";
import { env } from "../config/env";
import { appRouter } from "./routes";
import { errorHandlerMiddleware } from "../middlewares/errorHandler";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json());
app.use(appRouter);
app.use(errorHandlerMiddleware);

app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server started on: http://192.168.0.225:${env.PORT}`);
});

