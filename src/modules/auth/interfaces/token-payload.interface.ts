export interface TokenPayload {
  sub: string; // user id
  iat?: number;
  exp?: number;
}