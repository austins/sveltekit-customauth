import { prismaClient } from "$lib/data/prismaClient.server";
import { error, type Cookies } from "@sveltejs/kit";
import { promisify } from "node:util";
import { randomBytes } from "node:crypto";
import type { CookieSerializeOptions } from "cookie";

const enum SessionCookie {
    AccessToken = "accessToken",
    RefreshToken = "refreshToken",
}

export type Session = {
    user: {
        id: string;
        displayName: string;
    };
};

const randomBytesAsync = promisify(randomBytes);

async function generateToken() {
    return (await randomBytesAsync(16)).toString("hex");
}

function getUserAgent(request: Request) {
    const userAgent = request.headers.get("user-agent");
    if (!userAgent || userAgent.trim().length === 0) {
        // User agent is required. Reject auth if it doesn't exist.
        throw error(400, "User agent could not be determined from the request.");
    }

    return userAgent;
}

function doesUserAgentMatch(request: Request, userAgent: string) {
    return request.headers.get("user-agent") === userAgent;
}

const cookieOptions: CookieSerializeOptions = {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: import.meta.env.PROD,
};

export async function createSession(opts: {
    userId: string;
    clientIpAddress: string;
    request: Request;
    cookies: Cookies;
}): Promise<Session> {
    const accessToken = await generateToken();
    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setHours(accessTokenExpiresAt.getHours() + 2);

    const refreshToken = await generateToken();
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30);

    const userSession = await prismaClient.userSession.create({
        data: {
            userId: opts.userId,
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            ipAddress: opts.clientIpAddress,
            userAgent: getUserAgent(opts.request),
        },
        select: {
            user: {
                select: {
                    id: true,
                    displayName: true,
                },
            },
        },
    });

    opts.cookies.set(SessionCookie.AccessToken, accessToken, { ...cookieOptions, expires: accessTokenExpiresAt });

    opts.cookies.set(SessionCookie.RefreshToken, refreshToken, { ...cookieOptions, expires: refreshTokenExpiresAt });

    return {
        user: {
            id: userSession.user.id,
            displayName: userSession.user.displayName,
        },
    };
}

export async function getSession(opts: {
    clientIpAddress: string;
    request: Request;
    cookies: Cookies;
}): Promise<Session | null> {
    const accessToken = opts.cookies.get(SessionCookie.AccessToken);
    if (accessToken) {
        const userSession = await prismaClient.userSession.findUnique({
            select: {
                id: true,
                userAgent: true,
                user: {
                    select: {
                        id: true,
                        displayName: true,
                    },
                },
            },
            where: { accessToken },
        });

        const isUserAgentInvalid = userSession && !doesUserAgentMatch(opts.request, userSession.userAgent);
        if (isUserAgentInvalid) {
            // User agent doesn't match, so delete the session.
            await prismaClient.userSession.delete({ where: { id: userSession.id } });
        }

        if (!userSession || isUserAgentInvalid) {
            opts.cookies.delete(SessionCookie.AccessToken, cookieOptions);
            opts.cookies.delete(SessionCookie.RefreshToken, cookieOptions);
            return null;
        }

        return {
            user: {
                id: userSession.user.id,
                displayName: userSession.user.displayName,
            },
        };
    }

    // Access token cookie has expired in the user's browser,
    // so try to use the refresh token to generate a new session.
    const refreshToken = opts.cookies.get(SessionCookie.RefreshToken);
    if (refreshToken) {
        const prevUserSession = await prismaClient.userSession.findUnique({
            select: {
                id: true,
                userAgent: true,
                user: { select: { id: true } },
            },
            where: { refreshToken },
        });

        const isUserAgentInvalid = prevUserSession && !doesUserAgentMatch(opts.request, prevUserSession.userAgent);
        if (isUserAgentInvalid) {
            // User agent doesn't match, so delete the session.
            await prismaClient.userSession.delete({ where: { id: prevUserSession.id } });
        }

        if (!prevUserSession || isUserAgentInvalid) {
            opts.cookies.delete(SessionCookie.AccessToken, cookieOptions);
            opts.cookies.delete(SessionCookie.RefreshToken, cookieOptions);
            return null;
        }

        // Create a new access token and refresh token ala sliding window.
        const session = await createSession({
            userId: prevUserSession.user.id,
            clientIpAddress: opts.clientIpAddress,
            request: opts.request,
            cookies: opts.cookies,
        });

        await prismaClient.userSession.delete({ where: { id: prevUserSession.id } });

        return session;
    }

    return null;
}

export async function deleteExpiredSessions() {
    await prismaClient.userSession.deleteMany({ where: { refreshTokenExpiresAt: { lte: new Date() } } });
}

export async function deleteSession(cookies: Cookies) {
    const accessToken = cookies.get(SessionCookie.AccessToken);
    const refreshToken = cookies.get(SessionCookie.RefreshToken);

    cookies.delete(SessionCookie.AccessToken, cookieOptions);
    cookies.delete(SessionCookie.RefreshToken, cookieOptions);

    if (accessToken) {
        await prismaClient.userSession.delete({ where: { accessToken } }).catch();
        return;
    }

    if (refreshToken) {
        await prismaClient.userSession.delete({ where: { refreshToken } }).catch();
    }
}
