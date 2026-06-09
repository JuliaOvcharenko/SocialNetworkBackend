import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { InternalServerError, NotFoundError } from "../../errors/app.errors";
import { prisma } from "../../prisma/client";
import { PostRepositoryContract } from "./types/post.contract";
import { Post } from "./types/post.types";
import { Prisma } from "../../../generated/prisma/client";

async function toggleReaction(
    model: "postLike" | "postHeart",
    uniqueKey: "userId_postId",
    userId: bigint,
    postId: bigint,
    countField: "postLike" | "postHeart",
): Promise<{ toggled: boolean; count: number }> {
    const where = { [uniqueKey]: { userId, postId } } as any;
    const existing = await (prisma[model] as any).findUnique({ where });

    if (existing) {
        await (prisma[model] as any).delete({ where: { id: existing.id } });
    } else {
        await (prisma[model] as any).create({ data: { userId, postId } });
    }

    const count = await (prisma[model] as any).count({ where: { postId } });
    return { toggled: !existing, count };
}

function getPostInclude() {
    return {
        author: {
            omit: { password: true },
            include: {
                profile: {
                    select: { avatar: true },
                },
            },
        },
        tags: { include: { tag: true } },
        images: true,
        links: true,
        views: { select: { id: true } },
        likes: { select: { id: true, userId: true } },
        hearts: { select: { id: true, userId: true } },
    };
}

function mapPost(post: any, userId?: number): Post {
    const userIdStr = userId?.toString();
    return {
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        topic: post.topic ?? null,
        createdAt: post.createdAt,
        likesCount: post.likes?.length ?? 0,
        viewsCount: post.views?.length ?? 0,
        heartsCount: post.hearts?.length ?? 0,
        tags: post.tags.map((t: any) => t.tag.name),
        images: post.images.map((img: any) => ({
            id: img.id.toString(),
            originalImage: img.original_image,
            compressedImage: img.compressed_image ?? img.original_image,
        })),
        links: post.links.map((l: any) => ({ id: l.id.toString(), url: l.url })),
        author: {
            id: post.author.id.toString(),
            username: post.author.username ?? null,
            avatarUrl: post.author.profile?.avatar ?? null,
        },
        isLiked: userIdStr
            ? post.likes?.some((l: any) => l.userId?.toString() === userIdStr)
            : false,
        isHearted: userIdStr
            ? post.hearts?.some((h: any) => h.userId?.toString() === userIdStr)
            : false,
    };
}

export const PostRepository: PostRepositoryContract = {
    async findAllPaginated(page, limit, userId?) {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: getPostInclude(),
            }),
            prisma.post.count(),
        ]);

        return { posts: posts.map((p) => mapPost(p, userId)), total };
    },

    async findByAuthorPaginated(authorId, page, limit, userId?) {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { author_id: BigInt(authorId) },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: getPostInclude(),
            }),
            prisma.post.count({ where: { author_id: BigInt(authorId) } }),
        ]);

        return { posts: posts.map((p) => mapPost(p, userId)), total };
    },

    async findById(postId, userId?) {
        const post = await prisma.post.findUnique({
            where: { id: BigInt(postId) },
            include: getPostInclude(),
        });

        if (!post) throw new NotFoundError("Post");

        return mapPost(post, userId);
    },

    async upsertTags(tagNames) {
        const tags = await Promise.all(
            tagNames.map((tagName) => {
                const name = tagName.replace(/^#/, "").trim();
                return prisma.tag.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                });
            }),
        );
        return tags.map((tag) => Number(tag.id));
    },

    async create(authorId, dto) {
        try {
            const post = await prisma.post.create({
                data: {
                    title: dto.title,
                    content: dto.content,
                    topic: dto.topic ?? null,
                    author_id: BigInt(authorId),
                    createdAt: new Date(),
                    tags: {
                        create: dto.tagIds?.map((tagId) => ({ tagId: BigInt(tagId) })) ?? [],
                    },
                    images: {
                        create:
                            dto.imageUrls?.map((url) => ({
                                originalImage: url,
                                compressed_image: url,
                            })) ?? [],
                    },
                    links: {
                        create: dto.links?.map((l) => ({ url: l.url })) ?? [],
                    },
                },
                include: getPostInclude(),
            });

            return mapPost(post);
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async update(postId, dto) {
        try {
            const data: Prisma.PostUpdateInput = {};

            if (dto.title) data.title = dto.title;
            if (dto.content) data.content = dto.content;
            if (dto.topic) data.topic = dto.topic;

            if (dto.tagIds) {
                data.tags = {
                    deleteMany: {},
                    create: dto.tagIds.map((tagId) => ({ tagId: BigInt(tagId) })),
                };
            }

            if (dto.imageUrls) {
                data.images = {
                    deleteMany: {},
                    create: dto.imageUrls.map((url) => ({
                        originalImage: url,
                        compressed_image: url,
                    })),
                };
            }

            if (dto.links) {
                data.links = {
                    deleteMany: {},
                    create: dto.links.map((l) => ({ url: l.url })),
                };
            }

            const post = await prisma.post.update({
                where: { id: BigInt(postId) },
                data,
                include: getPostInclude(),
            });

            return mapPost(post);
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async delete(postId) {
        try {
            await prisma.post.delete({ where: { id: BigInt(postId) } });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async toggleLike(userId, postId) {
        const { toggled, count } = await toggleReaction(
            "postLike",
            "userId_postId",
            BigInt(userId),
            BigInt(postId),
            "postLike",
        );
        return { liked: toggled, likesCount: count };
    },

    async toggleHeart(userId, postId) {
        const { toggled, count } = await toggleReaction(
            "postHeart",
            "userId_postId",
            BigInt(userId),
            BigInt(postId),
            "postHeart",
        );
        return { hearted: toggled, heartsCount: count };
    },
};

function handlePrismaError(error: unknown): Error {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") return new NotFoundError("Post");
        if (error.code === "P2002")
            return new InternalServerError(`Duplicate: ${JSON.stringify(error.meta?.target)}`);
        return new InternalServerError(`DB_ERROR: ${error.code}`);
    }
    console.error(error);
    return new InternalServerError();
}
