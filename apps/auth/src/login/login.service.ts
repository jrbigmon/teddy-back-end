import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../../@share/exceptions/unauthorized.expcetion';
import { comparePassword } from '../utils/crypto';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginInputDTO, LoginOutputDTO } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private unauthorizedError() {
    throw new UnauthorizedException('Unauthorized');
  }

  public async login(input: LoginInputDTO): Promise<LoginOutputDTO> {
    const { email, password } = input || {};

    if (!email || !password) {
      this.unauthorizedError();
    }

    const user = await this.userService.getByEmail(email);

    if (!user) {
      this.unauthorizedError();
    }

    if (!(await comparePassword(password, user.getPassword()))) {
      this.unauthorizedError();
    }

    const payload = { id: user.getId(), email: user.getEmail() };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
