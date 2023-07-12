import express from "express";
import * as UsersController from "../controllers/user.controller";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.post("/", UsersController.create);
router.post("/login", UsersController.login);
router.put("/", auth(), UsersController.updateUser);
router.delete("/:id", auth(), UsersController.deleteById);
router.get("/token/:token", UsersController.verifyUser);
router.get("/:id", UsersController.getById);
router.get("/", UsersController.paginatedUsers);

export default router;
