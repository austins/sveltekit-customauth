import { prismaClient } from "$lib/data/prismaClient.server";
import type { UserProviderType } from "@prisma/client";
import slug from "slug";

export type ProviderData = {
    providerType: UserProviderType;
    providerUserId: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
};

export async function getOrCreateUserByProvider(providerData: ProviderData): Promise<string> {
    let userId: string | null = null;

    const userProvider = await prismaClient.userProvider.findFirst({
        select: {
            user: { select: { id: true } },
        },
        where: {
            providerType: providerData.providerType,
            providerUserId: providerData.providerUserId,
        },
    });

    if (userProvider) {
        userId = userProvider.user.id;
    } else {
        const user = await prismaClient.user.create({
            data: {
                email: providerData.email,
                displayName: providerData.displayName,
                slug: slug(providerData.displayName),
                avatarUrl: providerData.avatarUrl,
                providers: {
                    create: {
                        providerType: providerData.providerType,
                        providerUserId: providerData.providerUserId,
                    },
                },
            },
            select: { id: true },
        });

        userId = user.id;
    }

    return userId;
}
