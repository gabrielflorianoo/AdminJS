import React from "react";

export default function ConfirmModal({
    isActive,
    onClose,
    onConfirm,
    title,
    message,
}) {
    if (!isActive) return null;

    return (
        <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">
                        {title || "Confirm action"}
                    </p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                </header>
                <section className="modal-card-body">
                    <p>{message || "Are you sure you want to proceed?"}</p>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-danger" onClick={onConfirm}>
                        Sim
                    </button>
                    <button className="button" onClick={onClose}>
                        Não
                    </button>
                </footer>
            </div>
        </div>
    );
}
