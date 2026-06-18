import { prisma } from "../../prisma/client";
import { NotFoundError } from "../../errors/app.errors";

export const AvatarService = {
    async uploadAvatar(userId: number, file: any) {
        const avatarUrl = file.filename;

        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new NotFoundError("Profile");
        }

        const updated = await prisma.profile.update({
            where: { userId },
            data: { avatar: avatarUrl },
        });

        return { avatar: updated.avatar };
    },
};
