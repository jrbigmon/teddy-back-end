import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtGuardService } from './jwt.guard.service';

@Injectable()
export class DecodeJwt implements CanActivate {
  constructor(private readonly jwtGuardService: JwtGuardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization }: any = request.headers;

    if (!authorization) {
      return true;
    }

    const authToken = authorization.replace(/bearer/gim, '').trim();

    const resp = this.jwtGuardService.decodeToken(authToken);

    request.decodedData = resp;

    return true;
  }
}
