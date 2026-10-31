import { useState } from "react";
import { api } from "../api";

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api(`/auth/${mode}`, { method: "POST", body: form });
      onAuth(data);
    } catch (err) { setError(err.message); }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>{mode === "login" ? "Login" : "Create account"}</h2>
      {error && <p className="error">{error}</p>}
      {mode === "register" && <input name="name" placeholder="Name" value={form.name} onChange={change} required />}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
      <input name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={change} required />
      <button>{mode === "login" ? "Login" : "Register"}</button>
      <p className="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "No account? Register" : "Have an account? Login"}
      </p>
    </form>
  );
}
