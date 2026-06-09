import { InferType } from "yup";
import { createPostSchema } from "../post.schema";

export interface PostAuthor {
    id: number;
    username: string | null;
    avatarUrl: string | null;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    topic: string;
    createdAt: Date;
    likesCount: number;
    viewsCount: number;
    heartsCount: number;
    tags: string[];
    images: string[];
    links: { url: string }[];
    author: PostAuthor;
    isLiked: boolean;
    isHearted: boolean;
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
    links?: { url: string }[];
}

export interface DeletePostResult {
    success: boolean;
}
