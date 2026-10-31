const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/taskController");
router.use(auth);
router.get("/stats", c.getStats);
router.route("/").get(c.getTasks).post(c.createTask);
router.route("/:id").put(c.updateTask).delete(c.deleteTask);
module.exports = router;
