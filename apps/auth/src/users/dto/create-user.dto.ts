import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInputDTO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
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
