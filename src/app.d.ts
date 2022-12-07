/* eslint-disable @typescript-eslint/consistent-type-imports */

/// <reference types="unplugin-icons/types/svelte" />

declare namespace App {
    interface Locals {
        session: import("$lib/auth/session.server").Session | null;
    }

    interface PageData {
        title?: string;
    }

    // interface Error {}
    // interface Platform {}
}

/*
// For custom actions
declare namespace svelte.JSX {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLProps<HTMLElement> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        outclick?: (event: any) => any;
    }
}
*/
