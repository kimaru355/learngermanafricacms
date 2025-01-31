import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import bcrypt from "bcrypt";

const api = "http://localhost:3000";

const createOwner = async () => {
    try {
        const prisma = new PrismaClient();
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
    await Promise.all(
        levels.map((level) =>
            axios
                .post(api + "/api/levels", level)
                .catch((error) =>
                    console.log("Error on level creation: ", error)
                )
        )
    );
    console.log("Levels created");
};

const createTopics = async () => {
    try {
        const levels = (await axios.get(api + "/api/levels")).data.data;
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
        await Promise.all(
            topics.map((topic) =>
                axios
                    .post(api + "/api/topics", topic)
                    .catch((error) =>
                        console.log("Error on topic creation: ", error)
                    )
            )
        );
    } catch (error) {
        console.log("Error on topics creation: ", error);
    }
    console.log("Topics created");
};

const createNotes = async () => {
    try {
        const topics = (await axios.get(api + "/api/topics")).data.data;
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
        await Promise.all(
            notes.map((note) =>
                axios
                    .post(api + "/api/notes", note)
                    .catch((error) =>
                        console.log("Error on note creation: ", error)
                    )
            )
        );
    } catch (error) {
        console.log("Error on notes creation: ", error);
    }

    console.log("Notes created");
};

const runAll = async () => {
    await createLevels();
    await createTopics();
    await createNotes();
    await createOwner();
};

runAll();
