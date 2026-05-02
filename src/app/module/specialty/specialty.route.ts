import { Router } from "express";
import { specialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", specialtyController.createSpecialty);
router.get("/", checkAuth(Role.PATIENT), specialtyController.getAllSpecialties);
router.delete("/:id", specialtyController.deleteSpecialty);
router.patch("/:id", specialtyController.updateSpecialty);

export const specialtyRoutes = router;
