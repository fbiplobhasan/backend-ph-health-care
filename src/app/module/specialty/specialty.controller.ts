/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialtyService.createSpecialty(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Specialty created successfully",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtyService.getAllSpecialties();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Specialties fetched successfully",
    data: result,
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtyService.deleteSpecialty(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

const updateSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await specialtyService.updateSpecialty(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Specialty updated successfully",
    data: result,
  });
});

export const specialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};
