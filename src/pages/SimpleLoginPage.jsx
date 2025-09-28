import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Users, Shield, BarChart3, ArrowLeft } from "lucide-react";

const roleMeta = {
  citizen: {
    label: "Citizen",
    icon: <Users className="w-6 h-6 text-blue-700" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-slate-50",
    border: "border-blue-300",
  },
  official: {
    label: "Official",
    icon: <Shield className="w-6 h-6 text-green-700" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-green-50 via-green-100 to-slate-50",
    border: "border-green-300",
  },
  analyst: {
    label: "Analyst",
    icon: <BarChart3 className="w-6 h-6 text-purple-700" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-purple-50 via-purple-100 to-slate-50",
    border: "border-purple-300",
  },
};

export default function SimpleLoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { role } = useParams();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const meta = roleMeta[role] || {
    label: "User",
    icon: <Users className="w-6 h-6 text-slate-500" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-slate-50 via-slate-100 to-white",
    border: "border-slate-300",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.username, form.password, role);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "var(--gradient-background)" }}
      aria-label="Login page"
    >
      <Card
        className={`w-full max-w-md p-8 rounded-xl shadow-lg ${meta.gradient} border ${meta.border} transition-all`}
      >
        <div className="flex items-center gap-2 mb-6">
          {meta.icon}
          <h2 className="text-2xl font-bold text-slate-800">
            Login{role ? ` as ${meta.label}` : ""}
          </h2>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} aria-label="Login form">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">Username</span>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoFocus
              aria-label="Username"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Password"
            />
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <button
          className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 transition"
          onClick={() => navigate("/")}
          aria-label="Back to role selection"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Role Selection
        </button>
      </Card>
      <footer className="mt-10 text-xs text-slate-400 text-center">
        &copy; {new Date().getFullYear()} INCOIS &mdash; Tarang Ocean Hazards Monitoring System
      </footer>
    </main>
  );
}
