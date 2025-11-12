import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Signup for tenant (creates tenant user)' })
  async signup(@Req() req: Request & any, @Body() body: SignupDto) {
    const prisma = req.prisma;
    const user = await this.authSvc.signup(prisma, body.email, body.password, 'CUSTOMER');

    const token = await this.authSvc.login({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: req.tenant.id,
    } as any);

    return { 
        user, 
        token 
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login tenant user' })
  async login(@Req() req: Request & any, @Body() body: LoginDto) {
    const prisma = req.prisma;
    const user = await this.authSvc.validateUser(prisma, body.email, body.password);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    
    const token = await this.authSvc.login({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: req.tenant.id,
    });

    return { 
        user, token 
    };
  }
}
