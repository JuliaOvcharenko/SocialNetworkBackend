import { InferType } from "yup";
import { createPostSchema } from "../post.schema";

export interface PostAuthor {
    id: number;
    nickname: string | null;
    avatarUrl: string;
    signatureUrl: string | null;
    isOnline: boolean;
}

export interface Post {
    id: number;
    title: string;
    text: string;
    createdAt: Date;
    likesCount: number;
    viewsCount: number;
    isLikedByMe: boolean;
    tags: string[];
    images: string[];
    links: { url: string; label?: string | null }[];
    author: PostAuthor;
}

export type CreatePostDTO = InferType<typeof createPostSchema>;

export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface PaginatedPosts {
    data: Post[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdatePostDTO {
    title?: string;
    content?: string;
    topic?: string;
    tags?: string[];
    tagIds?: number[];
    imageUrls?: string[];
    links?: { url: string; label?: string }[];
}

export interface DeletePostResult {
    success: boolean;
}