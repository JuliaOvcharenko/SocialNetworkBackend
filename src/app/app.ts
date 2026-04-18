import express from "express";
import { env } from "../config/env";
import { appRouter } from "./routes";
import { errorHandlerMiddleware } from "../middlewares/errorHandler";
import cors from "cors";
import path from "path";
import fs from 'fs';

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const MEDIA_ROOT = path.join(process.cwd(), 'media');
const directories = [
  path.join(MEDIA_ROOT, 'original'),
  path.join(MEDIA_ROOT, 'shakal'),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Создана папка: ${dir}`);
  }
});

app.use('/media', express.static(MEDIA_ROOT));

app.use(appRouter);
app.use(errorHandlerMiddleware);

app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server started on: http://192.168.0.225:${env.PORT}`);
});