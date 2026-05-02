import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";

// get all doctors
const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      contactNumber: true,
      address: true,
      isDeleted: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          emailVerified: true,
          isDeleted: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
          image: true,
        },
      },
      specialties: {
        select: {
          specialty: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });
  return doctors;
};

// get doctor by id
const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      contactNumber: true,
      address: true,
      isDeleted: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          emailVerified: true,
          isDeleted: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
          image: true,
        },
      },
      specialties: {
        select: {
          specialty: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return doctor;
};

// update doctor
const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!isDoctorExist) {
    // throw new AppError(status.NOT_FOUND, "Doctor not found");
    throw new Error("Doctor not found");
  }

  const { doctor: doctorData, specialties } = payload;

  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id,
        },
        data: {
          ...doctorData,
        },
      });
    }

    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, shouldDelete } = specialty;
        if (shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
            create: {
              doctorId: id,
              specialtyId,
            },
            update: {},
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(id);

  return doctor;
};

// delete doctor
const deleteDoctor = async (id: string) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  if (!isDoctorExist) {
    // throw new AppError(status.NOT_FOUND, "Doctor not found");
    throw new Error("Doctor not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    await tx.user.update({
      where: {
        id: isDoctorExist.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED, // Optional: you may also want to block the user
      },
    });
    await tx.session.deleteMany({
      where: {
        userId: isDoctorExist.userId,
      },
    });
  });
  return { message: "Doctor deleted successfully" };
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
