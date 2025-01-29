import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../../@share/exceptions/unauthorized.expcetion';
import { comparePassword } from '../utils/crypto';
import { UserService } from '../users/users.service';
import { LoginInputDTO, LoginOutputDTO } from './dto/login.dto';
import { JwtGuardService } from '../../../@share/auth-guard/jwt.guard.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtGuardService: JwtGuardService,
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

    const token = await this.jwtGuardService.genToken(payload);

    return {
      access_token: token,
    };
  }
}
