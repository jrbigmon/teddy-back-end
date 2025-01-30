import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDTO {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;
}

export class LoginOutputDTO {
  @ApiProperty({ type: String })
  access_token: string;
}
