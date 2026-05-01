import { PostRepository } from "./post.repository";
import { PostServiceContract } from "./types/post.contract";
import { PaginationQuery } from "./types/post.types";

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
        const tagIds = dto.tags?.length ? await PostRepository.upsertTags(dto.tags) : [];

        return PostRepository.create(userId, { ...dto, tagIds });
    },
};
