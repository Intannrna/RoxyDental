import { prisma } from '../config/database';
import { VisitStatus, Gender } from '../../generated/prisma';
import { AppError } from '../middlewares/error.middleware';

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
}

interface CreateVisitInput {
  patient: CreatePatientData;
  visit: CreateVisitData;
}

export class VisitService {
  private async generatePatientNumber(): Promise<string> {
    const count = await prisma.patient.count();
    return `P-${String(count + 1).padStart(6, '0')}`;
  }

  private async generateVisitNumber(): Promise<string> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayCount = await prisma.visit.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `V-${dateStr}-${String(todayCount + 1).padStart(4, '0')}`;
  }

  private async getNextQueueNumber(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastQueue = await prisma.visit.findFirst({
      where: {
        visitDate: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: { queueNumber: 'desc' }
    });

    return lastQueue ? lastQueue.queueNumber + 1 : 1;
  }

  async getVisits(page: number = 1, limit: number = 10, status?: VisitStatus, search?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: 'insensitive' } },
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
        { patient: { patientNumber: { contains: search, mode: 'insensitive' } } }
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
              fullName: true,
              phone: true,
              gender: true,
              dateOfBirth: true
            }
          },
          nurse: {
            select: {
              id: true,
              fullName: true
            }
          }
        },
        orderBy: {
          visitDate: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.visit.count({ where })
    ]);

    return {
      visits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
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
            fullName: true
          }
        },
        treatments: {
          include: {
            service: true,
            performer: {
              select: {
                id: true,
                fullName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        payments: true
      }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    return visit;
  }

  async createVisit(data: CreateVisitInput, nurseId: string) {
    const { patient, visit } = data;

    let patientRecord;

    if (patient.id) {
      patientRecord = await prisma.patient.findUnique({
        where: { id: patient.id }
      });

      if (!patientRecord) {
        throw new AppError('Pasien tidak ditemukan', 404);
      }
    } else {
      const existingPatient = await prisma.patient.findFirst({
        where: {
          phone: patient.phone
        }
      });

      if (existingPatient) {
        patientRecord = existingPatient;
      } else {
        const patientNumber = await this.generatePatientNumber();

        patientRecord = await prisma.patient.create({
          data: {
            patientNumber,
            fullName: patient.fullName,
            dateOfBirth: new Date(patient.dateOfBirth),
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            bloodType: patient.bloodType,
            allergies: patient.allergies,
            medicalHistory: patient.medicalHistory
          }
        });
      }
    }

    const visitNumber = await this.generateVisitNumber();
    const queueNumber = await this.getNextQueueNumber();

    const newVisit = await prisma.visit.create({
      data: {
        patientId: patientRecord.id,
        nurseId,
        visitNumber,
        visitDate: new Date(visit.visitDate),
        queueNumber,
        status: VisitStatus.WAITING,
        chiefComplaint: visit.chiefComplaint,
        bloodPressure: visit.bloodPressure,
        notes: visit.notes
      },
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    return newVisit;
  }

  async getQueue(search?: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const where: any = {
      visitDate: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        in: [VisitStatus.WAITING, VisitStatus.IN_PROGRESS]
      }
    };

    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: 'insensitive' } },
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
        { patient: { patientNumber: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const queue = await prisma.visit.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            patientNumber: true,
            fullName: true,
            phone: true
          }
        },
        nurse: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: {
        queueNumber: 'asc'
      }
    });

    return queue;
  }

  async updateVisitStatus(id: string, status: VisitStatus) {
    const visit = await prisma.visit.findUnique({
      where: { id }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: {
            fullName: true
          }
        }
      }
    });

    return updatedVisit;
  }

  async getCompletedVisits(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      status: VisitStatus.COMPLETED
    };

    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: 'insensitive' } },
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
        { patient: { patientNumber: { contains: search, mode: 'insensitive' } } }
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
              fullName: true,
              dateOfBirth: true,
              gender: true,
              phone: true
            }
          },
          treatments: {
            select: {
              id: true,
              diagnosis: true,
              service: {
                select: {
                  serviceName: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          visitDate: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.visit.count({ where })
    ]);

    return {
      visits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}