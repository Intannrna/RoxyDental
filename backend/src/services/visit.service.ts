import { prisma } from "../config/database";
import { VisitStatus, Gender } from "../../generated/prisma";
import { AppError } from "../middlewares/error.middleware";

interface CreatePatientData {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

interface CreateVisitData {
  visitDate: string;
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
  status?: VisitStatus;
}

export interface CreateVisitInput {
  patient: CreatePatientData;
  visit: CreateVisitData;
}

export class VisitService {
  private async generatePatientNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    const lastPatient = await prisma.patient.findFirst({
      where: {
        patientNumber: {
          startsWith: `P-${year}${month}`,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let sequence = 1;
    if (lastPatient) {
      const lastSequence = parseInt(lastPatient.patientNumber.split("-")[2]);
      sequence = lastSequence + 1;
    }

    return `P-${year}${month}-${String(sequence).padStart(4, "0")}`;
  }

  private async generateMedicalRecordNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    const lastPatient = await prisma.patient.findFirst({
      where: {
        medicalRecordNumber: {
          startsWith: `RM-${year}${month}`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let sequence = 1;
    if (lastPatient && lastPatient.medicalRecordNumber) {
      const lastSequence = parseInt(lastPatient.medicalRecordNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `RM-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }

  private async generateVisitNumber(): Promise<string> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");

    const rand = Math.floor(1000 + Math.random() * 9000);
    const ms = String(now.getMilliseconds()).padStart(3, "0");

    return `V-${dateStr}-${rand}${ms}`;
  }

  private async getNextQueueNumber(dateInput: Date, tx: any = prisma): Promise<number> {
    const today = new Date(dateInput);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastQueue = await tx.visit.findFirst({
      where: {
        visitDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { queueNumber: "desc" },
    });

    return lastQueue ? lastQueue.queueNumber + 1 : 1;
  }

  async getVisitByMedicalRecord(medicalRecordNumber: string) {
    const patient = await prisma.patient.findFirst({
      where: { medicalRecordNumber }
    });

    if (!patient) {
      throw new AppError("Pasien dengan nomor rekam medis tersebut tidak ditemukan", 404);
    }

    const visit = await prisma.visit.findFirst({
      where: {
        patientId: patient.id,
        status: VisitStatus.COMPLETED
      },
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true,
          },
        },
        treatments: {
          include: {
            service: true,
            performer: {
              select: {
                id: true,
                fullName: true,
                specialization: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        medications: {
          orderBy: {
            createdAt: "asc"
          }
        },
        payments: true,
      },
      orderBy: {
        visitDate: "desc"
      }
    });

    if (!visit) {
      throw new AppError("Kunjungan tidak ditemukan", 404);
    }

    return visit;
  }

  async getVisits(
    page: number = 1,
    limit: number = 10,
    status?: VisitStatus,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: "insensitive" } },
        { patient: { fullName: { contains: search, mode: "insensitive" } } },
        { patient: { patientNumber: { contains: search, mode: "insensitive" } } },
        { patient: { medicalRecordNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              patientNumber: true,
              medicalRecordNumber: true,
              fullName: true,
              phone: true,
              gender: true,
              dateOfBirth: true,
            },
          },
          nurse: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: {
          visitDate: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.visit.count({ where }),
    ]);

    return {
      visits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVisitById(id: string) {
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true,
          },
        },
        treatments: {
          include: {
            service: true,
            performer: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        payments: true,
      },
    });

    if (!visit) {
      throw new AppError("Kunjungan tidak ditemukan", 404);
    }

    return visit;
  }

  async getVisitByNumber(visitNumber: string) {
    const visit = await prisma.visit.findFirst({
      where: { visitNumber },
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true,
          },
        },
        treatments: {
          include: {
            service: true,
            performer: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        payments: true,
      },
    });

    if (!visit) {
      throw new AppError("Kunjungan tidak ditemukan", 404);
    }

    return visit;
  }

  async createVisit(data: CreateVisitInput, nurseId: string) {
    const { patient, visit } = data;

    // Use interactive transaction to ensure atomicity of queue number generation
    return await prisma.$transaction(async (tx) => {
      let patientRecord;

      // 1. Handle Patient Creation/Update
      if (patient.id) {
        patientRecord = await tx.patient.findUnique({
          where: { id: patient.id },
        });

        if (!patientRecord) {
          throw new AppError("Pasien tidak ditemukan", 404);
        }

        if (!patientRecord.medicalRecordNumber) {
          const medicalRecordNumber = await this.generateMedicalRecordNumber();
          patientRecord = await tx.patient.update({
            where: { id: patientRecord.id },
            data: { medicalRecordNumber }
          });
        }
      } else {
        const existingPatient = await tx.patient.findFirst({
          where: { phone: patient.phone },
        });

        if (existingPatient) {
          patientRecord = existingPatient;

          if (!patientRecord.medicalRecordNumber) {
            const medicalRecordNumber = await this.generateMedicalRecordNumber();
            patientRecord = await tx.patient.update({
              where: { id: patientRecord.id },
              data: { medicalRecordNumber }
            });
          }
        } else {
          const patientNumber = await this.generatePatientNumber();
          const medicalRecordNumber = await this.generateMedicalRecordNumber();

          patientRecord = await tx.patient.create({
            data: {
              patientNumber,
              medicalRecordNumber,
              fullName: patient.fullName,
              dateOfBirth: new Date(patient.dateOfBirth),
              gender: patient.gender,
              phone: patient.phone,
              email: patient.email,
              address: patient.address,
              bloodType: patient.bloodType,
              allergies: patient.allergies,
              medicalHistory: patient.medicalHistory,
            },
          });
        }
      }

      // 2. Dynamic Queue Logic
      const visitDateTime = new Date(visit.visitDate);
      const status = visit.status || VisitStatus.WAITING;

      // Global Lock for Queue Generation (Fixed Key) to prevent race conditions on shifting
      const LOCK_KEY = 123456789;
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${LOCK_KEY})`;

      // Count only WAITING and IN_PROGRESS visits (Active Queue) that are BEFORE this new visit
      const countBefore = await tx.visit.count({
        where: {
          visitDate: { lt: visitDateTime },
          status: { in: [VisitStatus.WAITING, VisitStatus.IN_PROGRESS] }
        }
      });

      const newQueueNumber = countBefore + 1;

      // Shift existing active visits that are AFTER this new visit
      await tx.visit.updateMany({
        where: {
          visitDate: { gte: visitDateTime },
          status: { in: [VisitStatus.WAITING, VisitStatus.IN_PROGRESS] }
        },
        data: {
          queueNumber: { increment: 1 }
        }
      });

      // 3. Create Visit
      for (let attempt = 1; attempt <= 5; attempt++) {
        const visitNumber = await this.generateVisitNumber();

        try {
          const newVisit = await tx.visit.create({
            data: {
              patientId: patientRecord.id,
              nurseId,
              visitNumber,
              visitDate: visitDateTime,
              queueNumber: newQueueNumber,
              status,
              chiefComplaint: visit.chiefComplaint,
              bloodPressure: visit.bloodPressure,
              notes: visit.notes,
            },
            include: {
              patient: true,
              nurse: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          });

          return newVisit;
        } catch (err: any) {
          const isDuplicateVisitNumber =
            err?.code === "P2002" &&
            Array.isArray(err?.meta?.target) &&
            err.meta.target.includes("visit_number");

          if (isDuplicateVisitNumber && attempt < 5) {
            continue;
          }

          throw err;
        }
      }

      throw new AppError("Gagal membuat nomor kunjungan unik", 500);
    });
  }

  async getQueue(search?: string) {
    const where: any = {
      status: {
        in: [VisitStatus.WAITING, VisitStatus.IN_PROGRESS],
      },
    };

    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: "insensitive" } },
        { patient: { fullName: { contains: search, mode: "insensitive" } } },
        { patient: { patientNumber: { contains: search, mode: "insensitive" } } },
        { patient: { medicalRecordNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    const queue = await prisma.visit.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            patientNumber: true,
            medicalRecordNumber: true,
            fullName: true,
            phone: true,
          },
        },
        nurse: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: [
        { visitDate: "asc" },
        { queueNumber: "asc" },
      ],
    });

    return queue;
  }

  async updateVisitStatus(id: string, status: VisitStatus) {
    const visit = await prisma.visit.findUnique({
      where: { id },
    });

    if (!visit) {
      throw new AppError("Kunjungan tidak ditemukan", 404);
    }

    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return updatedVisit;
  }

  async getCompletedVisits(
    page: number = 1,
    limit: number = 10,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      status: VisitStatus.COMPLETED,
    };

    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: "insensitive" } },
        { patient: { fullName: { contains: search, mode: "insensitive" } } },
        { patient: { patientNumber: { contains: search, mode: "insensitive" } } },
        { patient: { medicalRecordNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              patientNumber: true,
              medicalRecordNumber: true,
              fullName: true,
              dateOfBirth: true,
              gender: true,
              phone: true,
            },
          },
          treatments: {
            select: {
              id: true,
              diagnosis: true,
              service: {
                select: {
                  serviceName: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          visitDate: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.visit.count({ where }),
    ]);

    return {
      visits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateVisit(id: string, data: Partial<CreateVisitData>) {
    const visit = await prisma.visit.findUnique({ where: { id } });

    if (!visit) {
      throw new AppError("Kunjungan tidak ditemukan", 404);
    }

    const updateData: any = {};

    if (data.visitDate) updateData.visitDate = new Date(data.visitDate);
    if (data.chiefComplaint !== undefined) updateData.chiefComplaint = data.chiefComplaint;
    if (data.bloodPressure !== undefined) updateData.bloodPressure = data.bloodPressure;
    if (data.notes !== undefined) updateData.notes = data.notes;

    return await prisma.visit.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true,
          },
        },
        treatments: {
          include: {
            service: true,
            performer: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async updateVisitExamination(
    id: string,
    data: {
      chiefComplaint?: string;
      bloodPressure?: string;
      notes?: string;
    }
  ) {
    const visit = await prisma.visit.findUnique({ where: { id } });

    if (!visit) {
      throw new AppError("Kunjungan tidak ditemukan", 404);
    }

    return await prisma.visit.update({
      where: { id },
      data: {
        chiefComplaint: data.chiefComplaint,
        bloodPressure: data.bloodPressure,
        notes: data.notes,
      },
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true,
          },
        },
        treatments: {
          include: {
            service: true,
            performer: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }
}