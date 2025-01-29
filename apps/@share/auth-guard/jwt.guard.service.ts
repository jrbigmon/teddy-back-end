import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuardService {
  constructor(private readonly jwtService: JwtService) {}

  async validateToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async genToken(payload: { id: string; email: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
