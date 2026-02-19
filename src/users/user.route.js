
import { Router } from "express";
import {
  handleCreateUser,
  handleListUsers,
  handleGetUserById,
  handleDeleteUser,
  handleUpdateUser,
  handleSearchUserByEmail,
  handleCountUsers,
  handleUpdateUserPassword,
  handleCreateUsersBulk,
} from "./users.controller.js";

const router = Router();


router.post("/", handleCreateUser);
router.post("/bulk", handleCreateUsersBulk);
router.get("/", handleListUsers);
router.get("/search", handleSearchUserByEmail);
router.get("/count", handleCountUsers);
router.patch("/:id/password", handleUpdateUserPassword);
router.get("/:id", handleGetUserById);
router.delete("/:id", handleDeleteUser);
router.patch("/:id", handleUpdateUser);

export default router;
