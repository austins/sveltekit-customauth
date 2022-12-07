import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getOrCreateUserByProvider } from "$lib/auth/user.server";
import { createSession } from "$lib/auth/session.server";
import { OAuthApp } from "@octokit/oauth-app";
import { env } from "$env/dynamic/private";
import { UserProviderType } from "@prisma/client";

const oAuthApp = new OAuthApp({
    clientType: "oauth-app",
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    clientId: env.AUTH_GITHUB_CLIENTID!,
    clientSecret: env.AUTH_GITHUB_CLIENTSECRET!,
    /* eslint-enable @typescript-eslint/no-unnecessary-type-assertion */
});

export const GET: RequestHandler = async ({ url, getClientAddress, request, cookies, fetch, locals }) => {
    if (locals.session) {
        throw redirect(302, "/admin");
    }

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !state) {
        const { url: gitHubAuthUrl } = oAuthApp.getWebFlowAuthorizationUrl({
            allowSignup: false,
            scopes: ["read:user", "user:email"],
            redirectUrl: `${url.origin}${url.pathname}`,
        });

        throw redirect(302, gitHubAuthUrl);
    }

    const octokit = await oAuthApp.getUserOctokit({ code, state }).catch(() => {
        throw error(400, "The GitHub auth code is incorrect or expired.");
    });

    const { data } = await octokit.request("GET /user", { request: { fetch } }).catch(() => {
        throw error(500, "An error occurred while attempting to fetch user info from GitHub.");
    });

    const { id, avatar_url, name, login } = data;

    const gitHubUserId = id.toString();
    if (gitHubUserId !== env.AUTH_GITHUB_ALLOWEDUSERID) {
        throw error(401, "Unauthorized.");
    }

    let { email } = data;
    if (!email) {
        const { data: emails } = await octokit.request("GET /user/emails", { request: { fetch } }).catch(() => {
            throw error(500, "An error occurred while attempting to fetch user emails from GitHub.");
        });

        email = (emails.find((e) => {
            return e.primary;
        }) ?? emails[0])!.email;
    }

    const userId = await getOrCreateUserByProvider({
        providerType: UserProviderType.GitHub,
        providerUserId: gitHubUserId,
        email,
        displayName: name ?? login,
        avatarUrl: avatar_url,
    });

    locals.session = await createSession({
        userId,
        clientIpAddress: getClientAddress(),
        request,
        cookies,
    });

    throw redirect(302, "/admin");
};
