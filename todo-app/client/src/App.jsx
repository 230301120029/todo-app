import { useState, useEffect, useCallback } from "react";
import { api } from "./api";
import useTheme from "./useTheme";
import ThemeBar from "./ThemeBar";
import AuthForm from "./components/AuthForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const theme = useTheme();
  const [auth, setAuth] = useState(() => { try { return JSON.parse(localStorage.getItem("auth")); } catch { return null; } });
  const [data, setData] = useState({ tasks: [], total: 0, page: 1, pages: 1 });
  const [stats, setStats] = useState(null);
  const [q, setQuery] = useState({ status: "", priority: "", search: "", sortBy: "createdAt", order: "desc", page: 1 });
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const token = auth?.token;

  const logout = () => { localStorage.removeItem("auth"); setAuth(null); };
  const onAuth = (d) => { localStorage.setItem("auth", JSON.stringify(d)); setAuth(d); };

  const load = useCallback(async () => {
    if (!token) return;
    const params = new URLSearchParams({ ...q, limit: view === "board" ? 50 : 6 });
    [...params.keys()].forEach((k) => !params.get(k) && params.delete(k));
    try {
      const [d, s] = await Promise.all([api(`/tasks?${params}`, { token }), api("/tasks/stats", { token })]);
      setData(d); setStats(s); setError("");
    } catch (err) { err.status === 401 ? logout() : setError(err.message); }
  }, [token, q, view]);
  useEffect(() => { load(); }, [load]);

  const run = async (fn) => { try { await fn(); await load(); } catch (err) { setError(err.message); } };
  const save = (form) => run(async () => {
    if (editing) { await api(`/tasks/${editing._id}`, { method: "PUT", body: form, token }); setEditing(null); }
    else await api("/tasks", { method: "POST", body: form, token });
  });
  const status = (t, s) => run(() => api(`/tasks/${t._id}`, { method: "PUT", body: { status: s }, token }));
  const remove = (id) => window.confirm("Delete this task?") && run(() => api(`/tasks/${id}`, { method: "DELETE", token }));
  const setQ = (patch) => setQuery({ ...q, page: 1, ...patch });

  const header = <header className="bar"><h1 className="logo">✅ TaskFlow</h1><ThemeBar t={theme} /></header>;
  if (!auth) return <main className="wrap">{header}<AuthForm onAuth={onAuth} /></main>;

  const pct = stats?.total ? Math.round((stats.Completed / stats.total) * 100) : 0;
  const tiles = stats && [["📋 Total", stats.total], ["⏳ Pending", stats.Pending], ["🚀 In progress", stats["In-Progress"]], ["✅ Done", stats.Completed], ["⚠️ Overdue", stats.overdue]];

  return (
    <main className="wrap">
      {header}
      <div className="bar"><h2 style={{ margin: 0 }}>Hello, {auth.user.name} 👋</h2><button className="ghost" onClick={logout}>Logout</button></div>
      {error && <p className="err">{error}</p>}
      {tiles && (
        <>
          <section className="tiles">{tiles.map(([l, v]) => <div className="glass tile" key={l}><small className="muted">{l}</small><b>{v}</b></div>)}</section>
          <div className="glass" style={{ marginBottom: 16 }}><small className="muted">Overall progress: {pct}%</small><div className="prog"><i style={{ width: pct + "%" }} /></div></div>
        </>
      )}
      <TaskForm editing={editing} onSave={save} onCancel={() => setEditing(null)} />
      <div className="glass row filters">
        <input placeholder="🔍 Search title..." value={q.search} onChange={(e) => setQ({ search: e.target.value })} />
        <select value={q.status} onChange={(e) => setQ({ status: e.target.value })}><option value="">All statuses</option><option>Pending</option><option>In-Progress</option><option>Completed</option></select>
        <select value={q.priority} onChange={(e) => setQ({ priority: e.target.value })}><option value="">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
        <select value={q.sortBy} onChange={(e) => setQ({ sortBy: e.target.value })}><option value="createdAt">Sort: Created</option><option value="dueDate">Sort: Due date</option><option value="title">Sort: Title</option></select>
        <select value={q.order} onChange={(e) => setQ({ order: e.target.value })}><option value="desc">Desc</option><option value="asc">Asc</option></select>
        <button className="ghost" onClick={() => setView(view === "list" ? "board" : "list")}>{view === "list" ? "🗂 Board view" : "📃 List view"}</button>
      </div>
      <TaskList tasks={data.tasks} view={view} onStatus={status} onEdit={setEditing} onDelete={remove} />
      {view === "list" && (
        <div className="pager">
          <button className="ghost" disabled={data.page <= 1} onClick={() => setQuery({ ...q, page: q.page - 1 })}>← Prev</button>
          <span className="muted">Page {data.page} of {data.pages} · {data.total} tasks</span>
          <button className="ghost" disabled={data.page >= data.pages} onClick={() => setQuery({ ...q, page: q.page + 1 })}>Next →</button>
        </div>
      )}
    </main>
  );
}
