import React from "react";
import api from "../server/Api";

export default function ListModal({
    isActive,
    onClose,
    cardTitle = "Lista",
    fetchUrl,
    onElementClick,
    getElementLabel = (el) => el.name || el.title || `ID: ${el.id}`,
    filterElements = (data) => data, // por padrão, não filtra nada
    showCreateButton = false,
    createButtonText = "Criar",
    onCreateClick = () => {},
    loadingText = "Carregando...",
    emptyText = "Nenhum item encontrado.",
    errorText = "Erro ao buscar dados.",
}) {
    const [elements, setElements] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function fetchElements() {
            try {
                const response = await api.get(fetchUrl);
                const filtered = response.data.filter(filterElements);
                setElements(filtered || []);
            } catch (err) {
                setError(errorText);
            } finally {
                setLoading(false);
            }
        }

        if (isActive) fetchElements();
    }, [isActive, fetchUrl, filterElements, errorText]);

    return (
        <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{cardTitle}</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                </header>
                <section className="modal-card-body">
                    {loading ? (
                        <p>{loadingText}</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : elements.length === 0 ? (
                        <p>{emptyText}</p>
                    ) : (
                        <ul>
                            {elements.length > 0 && elements.map((el) => (
                                <li key={el.id} className="mb-2">
                                    <button
                                        className="button is-fullwidth is-link"
                                        onClick={() => onElementClick(el)}
                                    >
                                        {getElementLabel(el)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <footer className="modal-card-foot is-flex is-justify-content-space-between">
                    <button className="button is-link" onClick={onClose}>
                        Fechar
                    </button>
                    {showCreateButton && (
                        <section className="is-flex is-align-items-center gap-2">
                            <strong>Não achou o que procurava?</strong>
                            <button
                                className="button is-primary"
                                onClick={onCreateClick}
                            >
                                {createButtonText}
                            </button>
                        </section>
                    )}
                </footer>
            </div>
        </div>
    );
}
