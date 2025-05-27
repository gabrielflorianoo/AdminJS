import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const ROLES = ["VOLUNTEER", "COORDINATOR"];

const UserResourceOptions = {
    properties: {
        password: {
            type: "password",
        },
    },
    actions: {
        addRandom: {
            actionType: "resource",
            icon: "Add",
            label: "Inserir usuario aleatorio",
            isVisible: true,
            component: false,
            handler: async (request, response, context) => {
                const user = await prisma.user.create({
                    data: {
                        name: faker.person.fullName(),
                        email: faker.internet.email(),
                        password: faker.internet.password(),
                        role: ROLES[Math.random() >= 0.5 ? 1 : 0], // ou ADMIN/COORDINATOR
                    },
                });

                return {
                    record: user,
                    redirectUrl: context.h.resourceActionUrl({
                        resourceId: context.resource._decorated?.id(),
                        actionName: "list",
                    }),
                    notice: {
                        message: "Usuário aleatório criado com sucesso!",
                        type: "success",
                    },
                };
            },
        },
        new: {
            before: async (request) => {
                if (request.payload?.password) {
                    const hashed = await bcrypt.hash(
                        request.payload.password,
                        10
                    );
                    request.payload = {
                        ...request.payload,
                        password: hashed,
                    };
                }
                return request;
            },
        },
        edit: {
            before: async (request) => {
                if (request.payload?.password) {
                    const hashed = await bcrypt.hash(
                        request.payload.password,
                        10
                    );
                    request.payload = {
                        ...request.payload,
                        password: hashed,
                    };
                }
                return request;
            },
        },
    },
};

export default UserResourceOptions;
