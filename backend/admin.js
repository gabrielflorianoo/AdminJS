import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";
import UserResourceOptions from "./options/UserResourceOptions.js";

const prisma = new PrismaClient();

AdminJS.registerAdapter({ Database, Resource });

// 3. Cria o AdminJS
const adminJs = new AdminJS({
    rootPath: "/admin",
    resources: [
        {
            resource: { model: getModelByName("User"), client: prisma },
            options: UserResourceOptions,
        },
        {
            resource: { model: getModelByName("Student"), client: prisma },
            options: {
                actions: {
                    addRandom: {
                        actionType: "resource",
                        icon: "Add",
                        label: "Inserir aluno aleatório",
                        isVisible: true,
                        component: false,
                        handler: async (request, response, context) => {
                            const student = await prisma.student.create({
                                data: {
                                    name: faker.person.fullName(),
                                    email: faker.internet.email(),
                                    birthDate: faker.date.birthdate(),
                                    // createdAt and updatedAt are handled automatically by Prisma
                                },
                            });

                            return {
                                record: student,
                                redirectUrl: context.h.resourceActionUrl({
                                    resourceId:
                                        context.resource._decorated?.id(),
                                    actionName: "list",
                                }),
                                notice: {
                                    message:
                                        "Aluno aleatório criado com sucesso!",
                                    type: "success",
                                },
                            };
                        },
                    },
                },
            },
        },
        {
            resource: { model: getModelByName("Class"), client: prisma },
            options: {
                actions: {
                    addRandom: {
                        actionType: "resource",
                        icon: "Add",
                        label: "Inserir classe aleatória",
                        isVisible: true,
                        component: false,
                        handler: async (request, response, context) => {
                            // Busca um coordenador aleatório
                            const coordinators = await prisma.user.findMany({
                                where: { role: "COORDINATOR" },
                            });

                            if (coordinators.length === 0) {
                                return {
                                    notice: {
                                        message:
                                            "Não há coordenadores suficientes para criar uma turma.",
                                        type: "error",
                                    },
                                };
                            }

                            const randomCoordinator =
                                coordinators[
                                    Math.floor(
                                        Math.random() * coordinators.length
                                    )
                                ];

                            const randomName = `Turma ${faker.string
                                .alpha({ length: 3 })
                                .toUpperCase()}`;
                            const randomDescription = faker.lorem.sentence();
                            const randomStartDate = faker.date.future();
                            const randomEndDate = faker.date.future({
                                refDate: randomStartDate,
                            });

                            const newClass = await prisma.class.create({
                                data: {
                                    name: randomName,
                                    description: randomDescription,
                                    coordinatorId: randomCoordinator.id,
                                    startDate: randomStartDate,
                                    endDate: randomEndDate,
                                },
                            });

                            return {
                                record: newClass,
                                redirectUrl: context.h.resourceActionUrl({
                                    resourceId:
                                        context.resource._decorated?.id(),
                                    actionName: "list",
                                }),
                                notice: {
                                    message:
                                        "Classe aleatória criada com sucesso!",
                                    type: "success",
                                },
                            };
                        },
                    },
                },
            },
        },
        {
            resource: { model: getModelByName("Enrollment"), client: prisma },
            options: {
                actions: {
                    addRandom: {
                        actionType: "resource",
                        icon: "Add",
                        label: "Inserir matrícula aleatória",
                        isVisible: true,
                        component: false,
                        handler: async (request, response, context) => {
                            // Busca um aluno e uma turma aleatórios
                            const students = await prisma.student.findMany();
                            const classes = await prisma.class.findMany();

                            if (students.length === 0 || classes.length === 0) {
                                return {
                                    notice: {
                                        message:
                                            "Não há alunos ou turmas suficientes para criar uma matrícula.",
                                        type: "error",
                                    },
                                };
                            }

                            const randomStudent =
                                students[
                                    Math.floor(Math.random() * students.length)
                                ];
                            const randomClass =
                                classes[
                                    Math.floor(Math.random() * classes.length)
                                ];

                            const enrollment = await prisma.enrollment.create({
                                data: {
                                    studentId: randomStudent.id,
                                    classId: randomClass.id,
                                    enrolledAt: faker.date.past(),
                                },
                            });

                            return {
                                record: enrollment,
                                redirectUrl: context.h.resourceActionUrl({
                                    resourceId:
                                        context.resource._decorated?.id(),
                                    actionName: "list",
                                }),
                                notice: {
                                    message:
                                        "Matrícula aleatória criada com sucesso!",
                                    type: "success",
                                },
                            };
                        },
                    },
                },
            },
        },
        {
            resource: { model: getModelByName("Attendance"), client: prisma },
            options: {},
        },
        {
            resource: { model: getModelByName("Grade"), client: prisma },
            options: {},
        },
    ],
});

const adminRouter = AdminJSExpress.buildRouter(adminJs);

export { adminJs, adminRouter, prisma };
