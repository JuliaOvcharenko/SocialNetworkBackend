import { ForbiddenError } from "../../errors/app.errors";
import { PostRepository } from "./post.repository";
import { PostServiceContract } from "./types/post.contract";
import { PaginationQuery, Post } from "./types/post.types";

const DEFAULT_LIMIT = 5;

function normalizePagination(query: PaginationQuery) {
    return {
        page: Math.max(1, Number(query.page) || 1),
        limit: Math.max(1, Number(query.limit) || DEFAULT_LIMIT),
    };
}

export const PostService: PostServiceContract = {
    async getAllPosts(query) {
        const { page, limit } = normalizePagination(query);
        const { posts, total } = await PostRepository.findAllPaginated(page, limit);

        return {
            data: posts,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    },

    async getMyPosts(userId, query) {
        const { page, limit } = normalizePagination(query);
        const { posts, total } = await PostRepository.findByAuthorPaginated(userId, page, limit);

        return {
            data: posts,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    },

    async createPost(userId, dto) {
        let tagIds: number[] = [];

        if (dto.tags && dto.tags.length) {
            tagIds = await PostRepository.upsertTags(dto.tags);
        }

        return PostRepository.create(userId, { ...dto, tagIds });
    },

    async updatePost(userId, postId, dto) {
        const post = (await PostRepository.findById(postId)) as Post;
        if (+post.author.id !== userId) {
            throw new ForbiddenError();
        }

        if (dto.tags && dto.tags.length) {
            const tagIds = await PostRepository.upsertTags(dto.tags);
            return PostRepository.update(postId, { ...dto, tagIds });
        }

        return PostRepository.update(postId, dto);
    },

    async deletePost(userId, postId) {
        const post = (await PostRepository.findById(postId)) as Post;

        if (+post.author.id !== userId) {
            throw new ForbiddenError();
        }

        await PostRepository.delete(postId);

        return { success: true };
    },

    async getUserPosts(userId, query) {
        const { page, limit } = normalizePagination(query);
        const { posts, total } = await PostRepository.findByAuthorPaginated(userId, page, limit);

        return {
            data: posts,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    },

    async toggleLike(userId, postId) {
        return PostRepository.toggleLike(userId, postId);
    },
    async toggleHeart(userId, postId) {
        return PostRepository.toggleHeart(userId, postId);
    },
};
