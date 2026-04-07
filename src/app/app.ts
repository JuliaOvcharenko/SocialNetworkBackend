import express from "express";
import { env } from "../config/env.js"

const app = express()

app.use(express.json())

app.listen(env.PORT, env.HOST, () => {
	console.log(`Server is started on: http://${env.HOST}:${env.PORT}`)
});