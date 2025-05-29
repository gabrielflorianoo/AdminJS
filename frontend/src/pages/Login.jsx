import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password)
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
                setError(err.response.data.error);
            });
    };

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: 400 }}>
                <h1 className="title">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label">E-mail</label>
                        <div className="control">
                            <input
                                type="email"
                                className="input"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Senha</label>
                        <div className="control">
                            <input
                                type="password"
                                className="input"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="field">
                            <div className="notification is-danger">
                                {error}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="button is-primary is-fullwidth"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </section>
    );
}
