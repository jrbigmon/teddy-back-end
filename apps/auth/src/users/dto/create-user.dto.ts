import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserInputDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class CreateUserOutputDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Date })
  createdAt?: Date;
}
