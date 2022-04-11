import { Router } from "express";
import {checkJwt} from "../Middleware/checkjwt";
import ProjectConfigController from "../Controller/ProjectConfigController";

const router = Router();

router.get("/:id", [checkJwt], ProjectConfigController.get);

router.post("", [checkJwt], ProjectConfigController.update);

export default router;
