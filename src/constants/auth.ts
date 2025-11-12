export const jwtConstants = {
  secret: process.env.JWT_SECRET || '3eb3fad0-1b94-460f-a148-29443c1796f4',
  expiresIn: process.env.JWT_EXPIRES_IN || 3600,
};