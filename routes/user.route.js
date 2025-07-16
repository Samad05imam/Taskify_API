import express from "express"
import {signup , login , logout} from "../controllers/user.controllers.js"
import isAuthenticated from "../middleware/isAuthenticated.js"


const router = express.Router();

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(isAuthenticated , logout)

export default router