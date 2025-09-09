import { Router } from "express";
import {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/", listUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
