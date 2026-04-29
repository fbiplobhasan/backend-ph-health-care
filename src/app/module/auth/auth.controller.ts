import { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.registerPatient(payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const loginPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.loginPatient(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Patient logged in successfully",
    data: result,
  });
});

export const authController = {
  createPatient,
  loginPatient,
};
