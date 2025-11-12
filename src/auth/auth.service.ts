import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(prisma: any, email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email }});
    
    if (!user) {
        return null
    };
    
    const matched = await bcrypt.compare(pass, user.password);
    if (!matched) {
        return null
    };

    return { 
        id: user.id, 
        email: user.email, 
        role: user.role 
    };
  }

  async login(payload: { sub: string; email: string; role: string; tenantId: string }) {
    const token = this.jwtService.sign(payload);
    return { 
        access_token: token 
    };
  }

  async signup(prisma: any, email: string, password: string, role = 'CUSTOMER') {
    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) {
         throw new ConflictException('Email already registered');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, role }});
    
    return { 
        id: user.id, 
        email: user.email, 
        role: user.role 
    };
  }
}
