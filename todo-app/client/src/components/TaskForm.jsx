import { useState, useEffect } from "react";
const empty = { title: "", description: "", status: "Pending", priority: "Medium", dueDate: "" };

export default function TaskForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);
  useEffect(() => {
    setForm(editing ? { ...empty, ...editing, dueDate: editing.dueDate ? editing.dueDate.slice(0, 10) : "" } : empty);
  }, [editing]);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    if (!editing) setForm(empty);
  }
  return (
    <form className="glass" onSubmit={submit} style={{ display: "grid", gap: 10, marginBottom: 16 }}>
      <h3 style={{ margin: 0 }}>{editing ? "✏️ Edit task" : "➕ New task"}</h3>
      <input name="title" placeholder="What needs to be done?" value={form.title} onChange={change} maxLength={100} required />
      <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={change} maxLength={500} />
      <div className="row">
        <select name="status" value={form.status} onChange={change}><option>Pending</option><option>In-Progress</option><option>Completed</option></select>
        <select name="priority" value={form.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select>
        <input name="dueDate" type="date" value={form.dueDate} onChange={change} />
      </div>
      <div className="row"><button>{editing ? "Update task" : "Add task"}</button>{editing && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}</div>
    </form>
  );
}
