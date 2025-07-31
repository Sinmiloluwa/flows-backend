export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    // You can extend the existing User interface if needed
    // interface User extends JwtPayload {}

    // Do not redeclare 'user' here to avoid type conflicts
  }
}
