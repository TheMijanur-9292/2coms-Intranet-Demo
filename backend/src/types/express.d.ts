import { Request } from 'express';

export interface AuthUser {
  id: string;
  companyId: string;
  departmentId?: string;
  role: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  companyFilter?: { companyId: string };
}
