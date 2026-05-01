import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { InternalServerError, NotFoundError } from "../../errors/app.errors";
import { prisma } from "../../prisma/client";
import { PostRepositoryContract } from "./types/post.contract";
import { Post } from "./types/post.types";

function getPostInclude() {
    return {
        author: {
            omit: { password: true },
            include: {
                avatars: {
                    where: { isActive: true },
                    include: { image: true },
                    take: 1,
                },
            },
        },
        tags: { include: { tag: true } },
        images: true,
        links: true,
    };
}

function mapPost(post: any) {
    return {
        id: post.id,
        title: post.title,
        text: post.content,
        createdAt: post.createdAt,
        likesCount: post.likesCount ?? 0,
        viewsCount: post.viewsCount ?? 0,
        isLikedByMe: post.isLikedByMe ?? false,
        tags: post.tags.map((t: any) => t.tag.name),
        images: post.images.map((img: any) => img.shakalImageURL ?? img.normalImageURL ?? null),
        links: post.links,
        author: {
            id: post.author.id,
            nickname: post.author.nickname,
            isOnline: post.author.isOnline ?? false,
            signatureUrl: post.author.signatureUrl ?? null,
            avatarUrl: post.author.avatars?.[0]?.image?.shakalImageURL ?? "",
        },
    };
}

export const PostRepository: PostRepositoryContract = {
    async findAllPaginated(page, limit) {
        const posts = await prisma.post.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: getPostInclude(),
        });

        const total = await prisma.post.count();

        return { posts: posts.map(mapPost), total };
    },

    async findByAuthorPaginated(authorId, page, limit) {
        const posts = await prisma.post.findMany({
            where: { authorId },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: getPostInclude(),
        });

        const total = await prisma.post.count({ where: { authorId } });

        return { posts: posts.map(mapPost), total };
    },

    async upsertTags(tagNames: string[]): Promise<number[]> {
        const ids: number[] = [];
        for (const tagName of tagNames) {
            const name = tagName.replace(/^#/, "").trim();
            const tag = await prisma.tag.upsert({
                where: { name },
                update: {},
                create: { name },
            });
            ids.push(tag.id);
        }
        return ids;
    },

    async create(authorId, dto) {
        try {
            const post = await prisma.post.create({
                data: {
                    title: dto.title,
                    content: dto.content,
                    topic: dto.topic ?? null,
                    authorId,
                    tags: { create: dto.tagIds?.map((tag_id) => ({ tag_id })) ?? [] },
                    images: {
                        create: dto.imageUrls?.map((shakalImageURL) => ({ shakalImageURL })) ?? [],
                    },
                    links: { create: dto.links ?? [] },
                },
                include: getPostInclude(),
            });

            return mapPost(post) as Post;
        } catch (error) {
            throw handlePrismaError(error);
        }
    },
};

function handlePrismaError(error: unknown): Error {
    if (error instanceof PrismaClientKnownRequestError) {
        console.log('Prisma error meta:', error.meta);
        if (error.code === "P2025") return new NotFoundError("Post");
        if (error.code === "P2002") return new InternalServerError(`Duplicate: ${JSON.stringify(error.meta?.target)}`);
        return new InternalServerError(`DB_ERROR: ${error.code}`);
    }
    return new InternalServerError();
}
