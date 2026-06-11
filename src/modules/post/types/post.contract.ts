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

export interface PostRepositoryContract {
    findAllPaginated(
        page: number,
        limit: number,
        userId?: number,
    ): Promise<{ posts: Post[]; total: number }>;
    findByAuthorPaginated(
        authorId: number,
        page: number,
        limit: number,
        userId?: number,
    ): Promise<{ posts: Post[]; total: number }>;
    upsertTags(tagNames: string[]): Promise<number[]>;
    create(authorId: number, dto: CreatePostDTO & { tagIds: number[] }): Promise<Post>;
    findById(postId: number, userId?: number): Promise<Post | null>;
    update(postId: number, dto: UpdatePostDTO & { tagIds?: number[] }): Promise<Post>;
    delete(postId: number): Promise<void>;
    toggleLike(userId: number, postId: number): Promise<{ liked: boolean; likesCount: number }>;
    toggleHeart(userId: number, postId: number): Promise<{ hearted: boolean; heartsCount: number }>;
}

export interface PostServiceContract {
getAllPosts: (query: PaginationQuery, userId?: number) => Promise<PaginatedPosts>;    getMyPosts(userId: number, query: PaginationQuery): Promise<PaginatedPosts>;
    createPost(userId: number, dto: CreatePostDTO): Promise<Post>;
    updatePost(userId: number, postId: number, dto: UpdatePostDTO): Promise<Post>;
    deletePost(userId: number, postId: number): Promise<DeletePostResult>;
    getUserPosts(
        userId: number,
        query: PaginationQuery,
        currentUserId?: number,
    ): Promise<PaginatedPosts>;
    toggleLike(userId: number, postId: number): Promise<{ liked: boolean; likesCount: number }>;
    toggleHeart(userId: number, postId: number): Promise<{ hearted: boolean; heartsCount: number }>;
}

export interface PostControllerContract {
    getAllPosts: (
        req: Request<object, PaginatedPosts, object, PaginationQuery>,
        res: Response<PaginatedPosts, LoginUser>,
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
    toggleLike: (
        req: Request<{ postId: string }, any, any, any, LoginUser>,
        res: Response<any, LoginUser>,
        next: NextFunction,
    ) => void;
    toggleHeart: (
        req: Request<{ postId: string }, any, any, any, LoginUser>,
        res: Response<any, LoginUser>,
        next: NextFunction,
    ) => void;
}
