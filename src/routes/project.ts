import { Router } from "express";
import {checkJwt} from "../Middleware/checkjwt";
import ProjectController from "../Controller/ProjectController";

const router = Router();

router.get("/all", [checkJwt], ProjectController.all);
router.get("/:id", [checkJwt], ProjectController.id);
router.get("/:id/export", [checkJwt], ProjectController.export);
router.get("/:id/package", [checkJwt], ProjectController.package);

router.post("", [checkJwt], ProjectController.newProject);

router.delete("/:id", [checkJwt], ProjectController.delete)

export default router;
