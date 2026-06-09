import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { InternalServerError, NotFoundError } from "../../errors/app.errors";
import { prisma } from "../../prisma/client";
import { PostRepositoryContract } from "./types/post.contract";
import { Post } from "./types/post.types";
import { Prisma } from "../../../generated/prisma/client";

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
        isLiked: userId
            ? post.likes?.some((l: any) => l.userId?.toString() === userId.toString())
            : false,
        isHearted: userId
            ? post.hearts?.some((h: any) => h.userId?.toString() === userId.toString())
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
        const ids: number[] = [];
        for (const tagName of tagNames) {
            const name = tagName.replace(/^#/, "").trim();
            const tag = await prisma.tag.upsert({
                where: { name },
                update: {},
                create: { name },
            });
            ids.push(Number(tag.id));
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
            await prisma.$transaction([
                prisma.postLike.deleteMany({ where: { postId: BigInt(postId) } }),
                prisma.postView.deleteMany({ where: { postId: BigInt(postId) } }),
                prisma.postHeart.deleteMany({ where: { postId: BigInt(postId) } }),
                prisma.tagPost.deleteMany({ where: { postId: BigInt(postId) } }),
                prisma.postImage.deleteMany({ where: { postId: BigInt(postId) } }),
                prisma.postLink.deleteMany({ where: { postId: BigInt(postId) } }),
                prisma.post.delete({ where: { id: BigInt(postId) } }),
            ]);
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async toggleLike(userId, postId) {
        const existing = await prisma.postLike.findUnique({
            where: { userId_postId: { userId: BigInt(userId), postId: BigInt(postId) } },
        });
        if (existing) {
            await prisma.postLike.delete({ where: { id: existing.id } });
        } else {
            await prisma.postLike.create({
                data: { userId: BigInt(userId), postId: BigInt(postId) },
            });
        }
        const likesCount = await prisma.postLike.count({ where: { postId: BigInt(postId) } });
        return { liked: !existing, likesCount };
    },

    async toggleHeart(userId, postId) {
        const existing = await prisma.postHeart.findUnique({
            where: { userId_postId: { userId: BigInt(userId), postId: BigInt(postId) } },
        });
        if (existing) {
            await prisma.postHeart.delete({ where: { id: existing.id } });
        } else {
            await prisma.postHeart.create({
                data: { userId: BigInt(userId), postId: BigInt(postId) },
            });
        }
        const heartsCount = await prisma.postHeart.count({ where: { postId: BigInt(postId) } });
        return { hearted: !existing, heartsCount };
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
