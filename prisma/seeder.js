import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createOwner = async () => {
    try {
        const user = await prisma.user.create({
            data: {
                email: process.env.OWNER_EMAIL,
                isEmailVerified: true,
                name: process.env.OWNER_NAME,
                password: bcrypt.hashSync(process.env.OWNER_PASSWORD, 10),
                role: "OWNER",
            },
        });
        console.log("Owner created", user);
    } catch (error) {
        console.log("Error creating owner", error.message);
    }
};

const createAdmin = async () => {
    try {
        const user = await prisma.user.create({
            data: {
                email: process.env.ADMIN_EMAIL,
                isEmailVerified: true,
                name: process.env.ADMIN_NAME,
                password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
                role: "ADMIN",
            },
        });
        console.log("Admin created", user);
    } catch (error) {
        console.log("Error creating Admin", error.message);
    }
};

const createLevels = async () => {
    const levels = [
        {
            name: "A1",
            imageUrl: faker.image.url(),
            description: faker.word.words(20),
        },
        {
            name: "A2",
            imageUrl: faker.image.url(),
            description: faker.word.words(20),
        },
        {
            name: "B1",
            imageUrl: faker.image.url(),
            description: faker.word.words(20),
        },
        {
            name: "B2",
            imageUrl: faker.image.url(),
            description: faker.word.words(20),
        },
        {
            name: "C1",
            imageUrl: faker.image.url(),
            description: faker.word.words(20),
        },
        {
            name: "C2",
            imageUrl: faker.image.url(),
            description: faker.word.words(20),
        },
    ];
    try {
        await prisma.level.createMany({
            data: levels,
        });
        console.log("Levels created");
    } catch (error) {
        console.log("Error on levels creation: ", error);
    }
};

const createTopics = async () => {
    try {
        const levels = await prisma.level.findMany();
        let topics = [];
        levels.map((level) => {
            for (let i = 0; i < 5; i++) {
                topics.push({
                    name: faker.word.words(2),
                    description: faker.word.words(20),
                    imageUrl: faker.image.url(),
                    levelId: level.id,
                });
            }
        });
        await prisma.topic.createMany({
            data: topics,
        });
        console.log("Topics created");
    } catch (error) {
        console.log("Error on topics creation: ", error);
    }
};

const createNotes = async () => {
    try {
        const topics = await prisma.topic.findMany();
        let notes = [];
        topics.map((topic) => {
            for (let i = 0; i < 5; i++) {
                notes.push({
                    content: faker.lorem.paragraphs(4),
                    number: i + 1,
                    topicId: topic.id,
                });
            }
        });
        await prisma.note.createMany({
            data: notes,
        });
        console.log("Notes created");
    } catch (error) {
        console.log("Error on notes creation: ", error);
    }
};

const runAll = async () => {
    await createLevels();
    await createTopics();
    await createNotes();
    await createOwner();
    await createAdmin();
};

runAll();
