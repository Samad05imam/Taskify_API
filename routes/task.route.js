import express from "express"
import { createTask , getTasks , getTaskById , updateTask , deleteTask } from "../controllers/task.controllers.js"
import isAuthenticated from "../middleware/isAuthenticated.js"


const router = express.Router();

router.route("/create").post(isAuthenticated , createTask);
router.route("/getall").get(isAuthenticated , getTasks);
router.route("/getsingle/:id").get(isAuthenticated , getTaskById);
router.route("/update/:id").put(isAuthenticated , updateTask);
router.route("/delete/:id").delete(isAuthenticated , deleteTask);


export default router;
