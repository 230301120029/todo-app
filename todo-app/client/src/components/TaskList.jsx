const ST = ["Pending", "In-Progress", "Completed"];
const ICON = { Pending: "⏳", "In-Progress": "🚀", Completed: "✅" };

export function Card({ t, onStatus, onEdit, onDelete, draggable }) {
  const late = t.dueDate && t.status !== "Completed" && new Date(t.dueDate) < new Date();
  return (
    <div className={`tcard ${t.status}`} draggable={draggable} onDragStart={(e) => e.dataTransfer.setData("id", t._id)}>
      <div className="thead"><strong className={t.status === "Completed" ? "done" : ""}>{t.title}</strong><span className={`pri ${t.priority}`}>{t.priority}</span></div>
      {t.description && <p className="muted" style={{ margin: 0 }}>{t.description}</p>}
      {t.dueDate && <small className={late ? "late" : "muted"}>📅 {new Date(t.dueDate).toLocaleDateString()}{late && " · Overdue"}</small>}
      <div className="row act">
        <select value={t.status} onChange={(e) => onStatus(t, e.target.value)}>{ST.map((s) => <option key={s}>{s}</option>)}</select>
        <button className="ghost" onClick={() => onEdit(t)}>✏️</button>
        <button className="danger" onClick={() => onDelete(t._id)}>🗑</button>
      </div>
    </div>
  );
}

export default function TaskList({ tasks, view, ...p }) {
  if (!tasks.length) return <p className="muted center">No tasks found. Add your first one! 🎯</p>;
  if (view === "list") return <div className="grid">{tasks.map((t) => <Card key={t._id} t={t} {...p} />)}</div>;
  return (
    <div className="board">
      {ST.map((s) => (
        <div key={s} className="col glass" onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { const t = tasks.find((x) => x._id === e.dataTransfer.getData("id")); if (t && t.status !== s) p.onStatus(t, s); }}>
          <h3 style={{ margin: 0 }}>{ICON[s]} {s} <span className="muted">({tasks.filter((t) => t.status === s).length})</span></h3>
          {tasks.filter((t) => t.status === s).map((t) => <Card key={t._id} t={t} draggable {...p} />)}
        </div>
      ))}
    </div>
  );
}
