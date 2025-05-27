import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// List all students
export async function getAllStudents(req, res) {
    try {
        const students = await prisma.student.findMany({
            include: {
                enrollments: true,
                attendances: true,
                grades: true,
            },
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar estudantes." });
    }
}

// Get student by ID
export async function getStudentById(req, res) {
    const { id } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { id: Number(id) },
            include: {
                enrollments: true,
                attendances: true,
                grades: true,
            },
        });
        if (!student)
            return res.status(404).json({ error: "Estudante não encontrado." });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar estudante." });
    }
}

// Create new student
export async function createStudent(req, res) {
    const { name, email, birthDate } = req.body;
    try {
        const student = await prisma.student.create({
            data: {
                name,
                email,
                birthDate: birthDate ? new Date(birthDate) : undefined,
            },
        });
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar estudante." });
    }
}

// Update student
export async function updateStudent(req, res) {
    const { id } = req.params;
    const { name, email, birthDate } = req.body;
    try {
        const student = await prisma.student.update({
            where: { id: Number(id) },
            data: {
                name,
                email,
                birthDate: birthDate ? new Date(birthDate) : undefined,
            },
        });
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar estudante." });
    }
}

// Delete student
export async function deleteStudent(req, res) {
    const { id } = req.params;
    try {
        await prisma.enrollment.deleteMany({
            where: { studentId: Number(id) },
        });
        await prisma.attendance.deleteMany({
            where: { studentId: Number(id) },
        });
        await prisma.grade.deleteMany({ where: { studentId: Number(id) } });
        await prisma.student.delete({ where: { id: Number(id) } });
        res.json({ message: "Estudante deletado com sucesso." });
    } catch (error) {
        res.status(400).json({ error: "Erro ao deletar estudante." });
    }
}
