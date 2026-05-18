import { Request, Response, NextFunction } from "express";
import {
    CreatePostDTO,
    DeletePostResult,
    PaginatedPosts,
    PaginationQuery,
    Post,
    UpdatePostDTO,
} from "./post.types";
import { LoginUser } from "../../user/types/user.types";

export interface PostServiceContract {
    getAllPosts: (query: PaginationQuery) => Promise<PaginatedPosts>;
    getMyPosts: (userId: number, query: PaginationQuery) => Promise<PaginatedPosts>;
    createPost(userId: number, dto: CreatePostDTO): Promise<Post>;
    updatePost(userId: number, postId: number, dto: UpdatePostDTO): Promise<Post>;
    deletePost(userId: number, postId: number): Promise<DeletePostResult>;
    getUserPosts(userId: number, query: PaginationQuery): Promise<PaginatedPosts>;
}

export interface PostRepositoryContract {
    findAllPaginated: (page: number, limit: number) => Promise<{ posts: Post[]; total: number }>;
    findByAuthorPaginated: (
        authorId: number,
        page: number,
        limit: number,
    ) => Promise<{ posts: Post[]; total: number }>;
    upsertTags(tagNames: string[]): Promise<number[]>;
    create(authorId: number, dto: CreatePostDTO & { tagIds: number[] }): Promise<Post>;
    findById(postId: number): Promise<Post | null>;
    update(postId: number, dto: UpdatePostDTO & { tagIds?: number[] }): Promise<Post>;
    delete(postId: number): Promise<void>;
}

export interface PostControllerContract {
    getAllPosts: (
        req: Request<object, PaginatedPosts, object, PaginationQuery>,
        res: Response<PaginatedPosts>,
        next: NextFunction,
    ) => void;
    getMyPosts: (
        req: Request<object, PaginatedPosts, object, PaginationQuery, LoginUser>,
        res: Response<PaginatedPosts, LoginUser>,
        next: NextFunction,
    ) => void;
    getUserPosts: (
        req: Request<{ userId: string }, PaginatedPosts, object, PaginationQuery, LoginUser>,
        res: Response<PaginatedPosts, LoginUser>,
        next: NextFunction,
    ) => void;
    createPost: (
        req: Request<object, Post, CreatePostDTO, object, LoginUser>,
        res: Response<Post, LoginUser>,
        next: NextFunction,
    ) => void;
    uploadImage: (
        req: Request<object, { url: string }, object, object, LoginUser>,
        res: Response<{ url: string }, LoginUser>,
        next: NextFunction,
    ) => void;
    updatePost: (
        req: Request<{ postId: string }, Post, UpdatePostDTO, object, LoginUser>,
        res: Response<Post, LoginUser>,
        next: NextFunction,
    ) => void;
    deletePost: (
        req: Request<{ postId: string }, DeletePostResult, object, object, LoginUser>,
        res: Response<DeletePostResult, LoginUser>,
        next: NextFunction,
    ) => void;
}
