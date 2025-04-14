import React, { useState } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

interface SignupResponse {
    token: string;
    message?: string;
}

const handleSignup = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
        setError("Les mots de passe ne correspondent pas.");
        return;
    }

    try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data: SignupResponse = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");

        localStorage.setItem("token", data.token);
        navigate("/");
    } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite.");
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Inscription</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="w-full p-2 border rounded mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

const Signup = () => (
  <Router>
    <SignupForm />
  </Router>
);

export default Signup;
