import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { LeaveService } from '../services/leave.service';
import { successResponse } from '../utils/response.util';

const leaveService = new LeaveService();

export class LeaveController {
  async getAllApprovedLeaves(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leaves = await leaveService.getAllApprovedLeaves();
      res.json(successResponse('Data cuti berhasil diambil', leaves));
    } catch (error) {
      next(error);
    }
  }

  async getLeaveRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leaves = await leaveService.getLeaveRequests(req.user!.id);
      res.json(successResponse('Daftar cuti berhasil diambil', leaves));
    } catch (error) {
      next(error);
    }
  }

  async createLeaveRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leave = await leaveService.createLeaveRequest(req.user!.id, req.body);
      res.status(201).json(successResponse('Pengajuan cuti berhasil', leave));
    } catch (error) {
      next(error);
    }
  }
}