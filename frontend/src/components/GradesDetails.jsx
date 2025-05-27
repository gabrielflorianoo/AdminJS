import React from "react";
import api from "../server/Api";

export default function GradeDetails({ studentId, isActive, onClose }) {
    const [grades, setGrades] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function fetchGrades() {
            try {
                const response = await api.get(`/students/${studentId}`);
                setGrades(response.data.grades || []);
            } catch (err) {
                setError("Erro ao buscar notas.");
            } finally {
                setLoading(false);
            }
        }

        if (isActive) fetchGrades();
    }, [studentId, isActive]);

    return (
        <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Notas do(a) Aluno(a)</p>
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
                    ) : grades.length === 0 ? (
                        <p>Este aluno não possui notas registradas.</p>
                    ) : (
                        <table className="table is-fullwidth is-striped is-hoverable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nota</th>
                                    <th>Descrição</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((grade) => (
                                    <tr key={grade.id}>
                                        <td>{grade.id}</td>
                                        <td>{grade.value.toFixed(2)}</td>
                                        <td>{grade.description || "—"}</td>
                                        <td>
                                            {new Date(
                                                grade.date
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
                <footer className="modal-card-foot is-justify-content-flex-end">
                    <button className="button is-link" onClick={onClose}>
                        Fechar
                    </button>
                </footer>
            </div>
        </div>
    );
}
