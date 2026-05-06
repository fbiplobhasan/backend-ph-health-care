import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.createPatient);
router.post("/login", authController.loginPatient);
router.get("/me", checkAuth(Role.PATIENT), authController.getMe);
router.post("/refresh-token", authController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.PATIENT, Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR),
  authController.changePassword,
);
router.post("/logout", authController.logoutUser);
router.post("/verify-email", authController.verifyEmail);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);

export const authRoutes = router;
