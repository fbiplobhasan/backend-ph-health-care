import { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.registerPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Patient created successfully",
    data: {
      token,
      ...rest,
      accessToken,
      refreshToken,
    },
  });
});

const loginPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.loginPatient(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Patient logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

export const authController = {
  createPatient,
  loginPatient,
};
