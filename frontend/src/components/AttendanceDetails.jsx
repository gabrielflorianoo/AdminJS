import React from "react";
import api from "../server/Api";

export default function AttendanceDetails({ studentId, isActive, onClose }) {
    const [attendances, setAttendances] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function fetchAttendances() {
            try {
                const response = await api.get(`/students/${studentId}`);

                setAttendances(response.data.attendances || []);
            } catch (err) {
                setError("Erro ao buscar presenças.");
            } finally {
                setLoading(false);
            }
        }

        if (isActive) fetchAttendances();
    }, [studentId, isActive]);

    return (
        <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Presenças do(a) Aluno(a)</p>
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
                    ) : attendances.length === 0 ? (
                        <p>Este aluno não possui presença.</p>
                    ) : (
                        <table className="table is-fullwidth is-striped is-hoverable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data</th>
                                    <th>Presença</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.map((attendance) => (
                                    <tr key={attendance.id}>
                                        <td>{attendance.id}</td>
                                        <td>{attendance.date}</td>
                                        <td>
                                            {attendance.present
                                                ? "Presente"
                                                : "Faltou"}
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
