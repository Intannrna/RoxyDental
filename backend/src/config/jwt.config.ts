export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'roxydental_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  issuer: 'RoxyDental',
  audience: 'RoxyDental-Client'
};

export const jwtOptions = {
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
  expiresIn: jwtConfig.expiresIn
};