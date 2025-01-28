export class CreateUserInputDTO {
  name: string;
  email: string;
  password: string;
}

export class CreateUserOutputDTO {
  id: string;
  name: string;
  createdAt?: Date;
}
