import { Router } from "express";
import { createPostSchema } from "./post.schema";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";
import { PostController } from "./post.controller";
import { processImageMiddleware, uploadMiddleware } from "../../middlewares/upload.middleware";

export const PostRoutes = Router();

PostRoutes.get("/", PostController.getAllPosts);

PostRoutes.get("/my", authenticateMiddleware, PostController.getMyPosts);

PostRoutes.post(
    "/upload",
    authenticateMiddleware,
    uploadMiddleware.single("image"),
    processImageMiddleware(800),
    PostController.uploadImage,
);

PostRoutes.post(
    "/",
    authenticateMiddleware,
    validateMiddleware(createPostSchema),
    PostController.createPost,
);

