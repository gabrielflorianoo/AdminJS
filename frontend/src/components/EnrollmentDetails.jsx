import React from "react";
import ListModal from "./ListModal";
import { useNavigate } from "react-router-dom";

import api from "../server/Api";

export default function EnrollmentDetails({ studentId, isActive, onClose }) {
    const [enrollments, setEnrollments] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const [isListModalActive, setIsListModalActive] = React.useState(false);

    async function fetchClassName(classId) {
        try {
            const response = await api.get(`/classes/${classId}`);
            return response.data.name;
        } catch (err) {
            console.error("Erro ao buscar nome da turma:", err);
            return "Sem nome";
        }
    }

    React.useEffect(() => {
        async function fetchEnrollments() {
            try {
                const response = await api.get(`/students/${studentId}`);

                const enrollmentsFixed = await Promise.all(
                    response.data.enrollments.map(async (enrollment) => ({
                        ...enrollment,
                        class: await fetchClassName(enrollment.classId),
                    }))
                );

                setEnrollments(enrollmentsFixed || []);
            } catch (err) {
                setError("Erro ao buscar matrículas.");
            } finally {
                setLoading(false);
            }
        }

        if (isActive) fetchEnrollments();
    }, [studentId, isActive]);

    return (
        <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">
                        Matrículas do(a) Aluno(a)
                    </p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                </header>
                <section className="modal-card-body">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : enrollments.length === 0 ? (
                        <p>Este aluno não possui matrículas.</p>
                    ) : (
                        <table className="table is-fullwidth is-striped is-hoverable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Turma</th>
                                    <th>Data de Matrícula</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((enrollment) => (
                                    <tr key={enrollment.id}>
                                        <td>{enrollment.id}</td>
                                        <td>
                                            {enrollment.class || "Sem turma"}
                                        </td>
                                        <td>
                                            {new Date(
                                                enrollment.enrolledAt
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
                <footer className="modal-card-foot is-flex is-justify-content-space-between">
                    <button
                        className="button is-primary"
                        onClick={() => setIsListModalActive(true)}
                    >
                        Matricular Aluno(a)
                    </button>
                    <button className="button is-link" onClick={onClose}>
                        Fechar
                    </button>
                </footer>
            </div>

            {isListModalActive && (
                <ListModal
                    isActive={isListModalActive}
                    onClose={() => setIsListModalActive(false)}
                    modalType="classes"
                    cardTitle="Turmas Disponíveis"
                    fetchUrl="/classes"
                    onElementClick={(classItem) => {
                        api.post(`/enrollments`, {
                            studentId,
                            classId: classItem.id,
                        }).then(() => {
                            setIsListModalActive(false);
                            onClose();
                            window.location.reload();
                        }).catch((err) => {
                            console.error("Erro ao matricular aluno:", err);
                            setError("Erro ao matricular aluno.");
                        });
                    }}
                    showCreateButton
                    createButtonText="Criar Turma"
                    onCreateClick={() => navigate("/create/classes")}
                />
            )}
        </div>
    );
}
