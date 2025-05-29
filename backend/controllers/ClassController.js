import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Listar todas as turmas
export const getAllClasses = async (req, res) => {
    try {
        const classes = await prisma.class.findMany({
            include: {
                responsible: true,
                enrollments: true,
            },
        });
        res.json(classes);
    } catch (error) {
        console.error("Erro ao buscar turmas:", error);
        res.status(500).json({ error: "Erro ao buscar turmas." });
    }
};

// Lista uma turma pelo ID
export const getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const classItem = await prisma.class.findUnique({
            where: { id: Number(id) },
            include: {
                responsible: true,
                enrollments: {
                    include: {
                        student: true,
                    },
                },
            },
        });
        if (!classItem) {
            return res.status(404).json({ error: "Turma não encontrada." });
        }
        res.json(classItem);
    } catch (error) {
        console.error("Erro ao buscar turma:", error);
        res.status(500).json({ error: "Erro ao buscar turma." });
    }
};

// Criar uma nova turma
export const createClass = async (req, res) => {
    const { name, responsible, studentIds, startDate, endDate } = req.body;
    try {
        const newClass = await prisma.class.create({
            data: {
                name,
                responsible: { connect: { id: responsible.id } },
                ...(studentIds?.length && {
                    enrollments: {
                        connect: studentIds.map((id) => ({ id })),
                    },
                }),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
            include: {
                responsible: true,
                enrollments: true,
            },
        });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar uma turma
export const updateClass = async (req, res) => {
    const { id } = req.params;
    const { name, responsibleId, studentIds } = req.body;
    try {
        const updatedClass = await prisma.class.update({
            where: { id: Number(id) },
            data: {
                name,
                responsible: teacherId
                    ? { connect: { id: responsibleId } }
                    : undefined,
                enrollments: studentIds
                    ? {
                          set: studentIds.map((id) => ({ id })),
                      }
                    : [],
            },
            include: {
                responsible: true,
                enrollments: true,
            },
        });
        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deletar uma turma
export const deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.class.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFields = async (req, res) => {
    const fields = [
        { name: "name", nameTranslated: "Nome", type: "text" },
        { name: "responsible", nameTranslated: "Responsável", type: "id" },
        { name: "startDate", nameTranslated: "Data de Início", type: "date" },
        { name: "endDate", nameTranslated: "Data de Fim", type: "date" },
    ];
    res.json(fields);
};
