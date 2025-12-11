import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { VisitService } from '../services/visit.service';
import { successResponse } from '../utils/response.util';

const visitService = new VisitService();

export class VisitController {
  async getVisits(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, search } = req.query;
      const result = await visitService.getVisits(
        Number(page) || 1,
        Number(limit) || 10,
        status as any,
        search as string
      );
      res.json(successResponse('Daftar kunjungan berhasil diambil', result));
    } catch (error) {
      next(error);
    }
  }

  async getVisitById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const visit = await visitService.getVisitById(req.params.id);
      res.json(successResponse('Detail kunjungan berhasil diambil', visit));
    } catch (error) {
      next(error);
    }
  }

  async createVisit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const visit = await visitService.createVisit(req.body, req.user!.id);
      res.status(201).json(successResponse('Kunjungan berhasil ditambahkan', visit));
    } catch (error) {
      next(error);
    }
  }

  async getQueue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;
      const queue = await visitService.getQueue(search as string);
      res.json(successResponse('Daftar antrian berhasil diambil', queue));
    } catch (error) {
      next(error);
    }
  }

  async updateVisitStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const visit = await visitService.updateVisitStatus(req.params.id, status);
      res.json(successResponse('Status kunjungan berhasil diupdate', visit));
    } catch (error) {
      next(error);
    }
  }

  async getCompletedVisits(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = req.query;
      const result = await visitService.getCompletedVisits(
        Number(page) || 1,
        Number(limit) || 10,
        search as string
      );
      res.json(successResponse('Daftar pasien berhasil diambil', result));
    } catch (error) {
      next(error);
    }
  }
}