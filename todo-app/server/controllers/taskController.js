const Task = require("../models/Task");

const SORTABLE = ["createdAt", "dueDate", "title", "status"];
const pick = (b) => ({ title: b.title, description: b.description, status: b.status, priority: b.priority, dueDate: b.dueDate || undefined });

// GET /api/tasks?status=&search=&sortBy=&order=&page=&limit=
exports.getTasks = async (req, res, next) => {
  try {
    const { status, search, sortBy = "createdAt", order = "desc" } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (search) filter.title = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    const sortField = SORTABLE.includes(sortBy) ? sortBy : "createdAt";

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ [sortField]: order === "asc" ? 1 : -1 }).skip((page - 1) * limit).limit(limit),
      Task.countDocuments(filter),
    ]);
    res.json({ tasks, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (e) { next(e); }
};

exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...pick(req.body), user: req.user.id });
    res.status(201).json(task);
  } catch (e) { next(e); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const update = Object.fromEntries(Object.entries(pick(req.body)).filter(([, v]) => v !== undefined));
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, update, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (e) { next(e); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (e) { next(e); }
};

exports.getStats = async (req, res, next) => {
  try {
    const mongoose = require("mongoose");
    const rows = await Task.aggregate([{ $match: { user: new mongoose.Types.ObjectId(req.user.id) } }, { $group: { _id: "$status", n: { $sum: 1 } } }]);
    const s = { Pending: 0, "In-Progress": 0, Completed: 0 };
    rows.forEach((r) => (s[r._id] = r.n));
    const overdue = await Task.countDocuments({ user: req.user.id, status: { $ne: "Completed" }, dueDate: { $lt: new Date() } });
    res.json({ ...s, overdue, total: s.Pending + s["In-Progress"] + s.Completed });
  } catch (e) { next(e); }
};
