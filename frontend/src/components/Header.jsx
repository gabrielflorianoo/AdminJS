import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" onClick={() => handleNavigate("/")}>
                    <strong>Projeto ELLP</strong>
                </a>

                <a
                    role="button"
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarBasic"
                    onClick={() => {
                        const burger = document.querySelector(".navbar-burger");
                        const menu = document.getElementById("navbarBasic");
                        burger.classList.toggle("is-active");
                        menu.classList.toggle("is-active");
                    }}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasic" className="navbar-menu">
                <div className="navbar-start">
                    <a className="navbar-item" onClick={() => handleNavigate("classes")}>
                        Turmas
                    </a>

                    <a className="navbar-item" onClick={() => handleNavigate("students")}>
                        Alunos
                    </a>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        {user ? (
                            <div className="buttons">
                                <span className="navbar-item">Olá, {user.name}</span>
                                <button className="button is-light" onClick={logout}>
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <div className="buttons">
                                <button
                                    className="button is-light"
                                    onClick={() => handleNavigate("login")}
                                >
                                    Login
                                </button>
                                <button
                                    className="button is-link"
                                    onClick={() => handleNavigate("register")}
                                >
                                    Registrar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}