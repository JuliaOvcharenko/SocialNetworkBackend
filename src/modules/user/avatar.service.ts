import { prisma } from "../../prisma/client";
import { NotFoundError } from "../../errors/app.errors";

export const AvatarService = {

    async replaceAvatar(userId: number, avatarId: number, file: any) {
        try {
            const avatarUrl = `/media/shakal/${file.filename}`;

            const existingAvatar = await prisma.avatar.findUnique({
                where: { id: avatarId },
                include: { image: true }
            });

            if (!existingAvatar || existingAvatar.userId !== userId) {
                throw new Error(`Аватарка ${avatarId} не найдена или чужая`);
            }

            const updatedImage = await prisma.image.update({
                where: { id: existingAvatar.imageId },
                data: {
                    shakalImageURL: avatarUrl,
                    normalImageURL: avatarUrl,
                }
            });

            return { avatar: updatedImage.shakalImageURL };

        } catch (error) {
            throw error;
        }
    },

    async uploadAvatar(userId: number, file: any, isMain: boolean = true) {
        const avatarUrl = `/media/shakal/${file.filename}`;

        return await prisma.$transaction(async (tx) => {
            const systemAlbum = await tx.album.findFirst({
                where: { userId, type: "system" }
            });

            if (!systemAlbum) {
                throw new NotFoundError("System album");
            }

            if (isMain) {
                await tx.avatar.updateMany({
                    where: { userId },
                    data: { isActive: false }
                });
            }

            const newImage = await tx.image.create({
                data: {
                    pathname: file.path,
                    shakalImageURL: avatarUrl,
                    normalImageURL: avatarUrl,
                }
            });

            const newAvatar = await tx.avatar.create({
                data: {
                    userId,
                    imageId: newImage.id,
                    isActive: isMain,
                    isShown: true,
                },
                include: { image: true }
            });

            await tx.albumAvatars.create({
                data: {
                    avatarId: newAvatar.id,
                    albumId: systemAlbum.id,
                }
            });

            return newAvatar;
        });
    }
};