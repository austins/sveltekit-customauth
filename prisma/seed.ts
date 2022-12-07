import chance from "chance";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function seedAny() {
    // Seed for any env.
}

async function seedDev() {
    const chanceInstance = chance.Chance();

    // Seed data for dev here.
}

void (async () => {
    try {
        await seedAny();

        if (process.env.NODE_ENV === "development") {
            await seedDev();
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await prismaClient.$disconnect();
    }
})();
