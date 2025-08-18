import { User } from '../src/database/schema';
import { Session, SessionData } from 'express-session';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session: Session & Partial<SessionData>;
      logout(callback: (err?: any) => void): void;
      isAuthenticated(): boolean;
    }
  }
}
