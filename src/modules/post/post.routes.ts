import { Router } from "express";
import { createPostSchema, updatePostSchema } from "./post.schema";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";
import { PostController } from "./post.controller";
import { processImageMiddleware, uploadMiddleware } from "../../middlewares/upload.middleware";

export const PostRoutes = Router();

PostRoutes.get("/", PostController.getAllPosts);

PostRoutes.get("/my", authenticateMiddleware, PostController.getMyPosts);
PostRoutes.get("/:userId", PostController.getUserPosts);

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

PostRoutes.patch(
    "/:postId",
    authenticateMiddleware,
    validateMiddleware(updatePostSchema),
    PostController.updatePost,
);

PostRoutes.delete(
    "/:postId",
    authenticateMiddleware,
    PostController.deletePost,
);