import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginInputDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class LoginOutputDTO {
  @ApiProperty({ type: String })
  access_token: string;
}
