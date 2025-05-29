import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../server/Api";;

const EditPage = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const dataTypes = {
        birthDate: "date",
        createdAt: "date",
        updatedAt: "date",
        email: "email",
    };
    const translatedTypes = {
        students: "Estudante",
        classes: "Turma",
        enrollments: "Matrícula",
        attendances: "Presença",
        grades: "Nota",
    }

    React.useEffect(() => {
        api
            .get(`/${type}/${id}`, {
                withCredentials: true,
            })
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [type, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        api
            .put(`/${type}/${id}`, data, {
                withCredentials: true,
            })
            .then(() => {
                navigate(`${type}`);
            }) // redirect to list page
            .catch((err) => console.error(err));
    };

    if (loading) return <p className="has-text-centered">Loading...</p>;

    return (
        <div className="container is-fluid m-5">
            <h1 className="title">Editar {translatedTypes[type]}</h1>
            <form onSubmit={handleSubmit}>
                {Object.entries(data).map(([key, value]) => {
                    if (key === "id") return null; // don't edit IDs
                    if (typeof value === "object" || Array.isArray(value))
                        return null; // skip objects/arrays

                    return (
                        <div className="field" key={key}>
                            <label className="label">{key}</label>
                            <div className="control">
                                <input
                                    type={dataTypes[key] || "text"}
                                    name={key}
                                    className="input"
                                    value={
                                        dataTypes[key] === "date"
                                            ? value.split("T")[0]
                                            : value
                                    }
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    );
                })}

                <div className="field">
                    <div className="control is-flex is-justify-content-space-between">
                        <button className="button is-primary" type="submit">
                            Salvar
                        </button>
                        <button className="button is-light" type="button" onClick={() => navigate(`${type}`)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditPage;
