import React, { useState } from "react";
import { Link } from "react-router-dom";
function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(""); // backend error
    const host = process.env.REACT_APP_API_HOST || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // clear old error

        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        });

        const json = await response.json();

        if (response.ok && json.authtoken) {
            localStorage.setItem("token", json.authtoken);
            window.location.href = "/"; // or navigate('/')
        } else {
            setError(json.error || "Something went wrong");
        }
    };

    return (
        <div className="justify-content-center main-content">
            <div className="card shadow-lg bg-dark text-light">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">🔑 Login</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control input-dark"
                                id="email"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control input-dark"
                                id="password"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, password: e.target.value })
                                }
                                required
                            />
                        </div>

                        {/* Show backend error */}
                        {error && <div className="text-danger mb-3">{error}</div>}

                        <div className="d-grid">
                            <button type="submit" className="btn">
                                <i className="bi bi-box-arrow-in-right" style={{ color: "#3c8dde" }}></i>
                            </button>
                        </div>
                    </form>
                    <div className="container text-center" style={{ position: "inherit" }}>
                        <p>
                            Don't have an account?{" "}
                            <Link
                                className="nav-link d-inline p-0 text-decoration-underline"
                                to="/signup"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
// Triggering deploy
