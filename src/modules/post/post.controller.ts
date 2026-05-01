import { PostService } from "./post.service";
import { PostControllerContract } from "./types/post.contract";

export const PostController: PostControllerContract = {
    async getAllPosts(req, res, next) {
        try {
            const result = await PostService.getAllPosts(req.query);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getMyPosts(req, res, next) {
        try {
            const result = await PostService.getMyPosts(res.locals.userId, req.query);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async createPost(req, res, next) {
        try {
            const post = await PostService.createPost(res.locals.userId, req.body);
            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    },

    async uploadImage(req, res, next) {
        try {
            if (!req.file) {
                res.status(400).json({ message: "No file uploaded" } as any);
                return;
            }
            const imageUrl = `/media/shakal/${req.file.filename}`;
            res.json({ url: imageUrl });
        } catch (error) {
            next(error);
        }
    },
};
