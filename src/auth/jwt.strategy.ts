import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/auth';

export type JwtPayload = {
  sub: string;
  email?: string;
  tenantId: string;
  [k: string]: any;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(req: JwtPayload) {
    const requestTenant = (req as any).tenantId;

    if (!requestTenant) {
      throw new UnauthorizedException('Tenant not resolved');
    }

    return {
      userId: req.sub,
      email: req.email,
      role: req.role,
      tenantId: req.tenantId,
    };
  }
}
