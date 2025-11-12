import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { jwtConstants } from '../constants/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(REQUEST) private readonly req: Request & any) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    } as any);
  }

  async validate(req: Request, payload: any) {
    const tokenTenantId = payload?.tenantId;
    const requestTenant = (req as any).tenant;
    if (!requestTenant) {
      throw new UnauthorizedException('Tenant not resolved');
    }
    if (!tokenTenantId || tokenTenantId !== requestTenant.id) {
      throw new UnauthorizedException('Token tenant mismatch');
    }

    return { 
        userId: payload.sub, 
        email: payload.email, 
        role: payload.role, 
        tenantId: payload.tenantId 
    };
  }
}
