import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../server/Api";

import ListModal from "../components/ListModal";

export default function CreatePage() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [data, setData] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [fields, setFields] = React.useState([]);

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const translatedTypes = {
        students: "Estudante",
        classes: "Turma",
        enrollments: "Matrícula",
        attendances: "Presença",
        grades: "Nota",
    };

    React.useEffect(() => {
        api.get(`/${type}/fields`)
            .then((res) => {
                setFields(res.data);
                // Inicializa o estado `data` com campos vazios
                const initialData = {};
                res.data.forEach((field) => {
                    initialData[field.name] = field.default || "";
                });
                setData(initialData);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        api.post(`/${type}`, data, {
            withCredentials: true,
        })
            .then(() => {
                navigate(`${type}`);
            })
            .catch((err) => console.error(err));
    };

    if (loading) return <p className="has-text-centered">Loading...</p>;

    return (
        <div className="container is-fluid m-5">
            <h1 className="title">Criar novo(a) {translatedTypes[type]}</h1>
            <form onSubmit={handleSubmit}>
                {fields.map((field) => {
                    return (
                        <div className="field" key={field.name}>
                            <label className="label">
                                {field.nameTranslated}
                            </label>
                            <div className="control">
                                {field.type !== "id" ? (
                                    <input
                                        type={field.type || "text"}
                                        name={field.name}
                                        className="input"
                                        value={
                                            field.type === "date" &&
                                            data[field.name]
                                                ? data[field.name].split("T")[0]
                                                : data[field.name] || ""
                                        }
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <button
                                        className={`button ${
                                            data[field.name]
                                                ? "is-primary"
                                                : "is-info"
                                        } is-fullwidth is-justify-content-left`}
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        {data[field.name]
                                            ? `Selecionado: ${
                                                  data[field.name].name ||
                                                  data[field.name]
                                              }`
                                            : `Selecione o(a) ${field.nameTranslated}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                <div className="field">
                    <div className="control is-flex is-justify-content-space-between">
                        <button className="button is-primary" type="submit">
                            Salvar
                        </button>
                        <button
                            className="button is-light"
                            type="button"
                            onClick={() => navigate(`${type}`)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>

            {isModalOpen && type === "classes" && (
                <ListModal
                    type={type}
                    isActive={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    cardTitle="Selecione o(a) responsável"
                    fetchUrl="/users"
                    filterElements={(el) =>
                        el.role !== "ADMIN" && el.role !== "VOLUNTEER"
                    }
                    getElementLabel={(el) => `${el.name} - ${el.email}`}
                    onElementClick={(el) => {
                        setData((prev) => ({ ...prev, responsible: el, responsibleId: el.id }));
                        setIsModalOpen(false);
                        console.log(data);
                    }}
                />
            )}
        </div>
    );
}
