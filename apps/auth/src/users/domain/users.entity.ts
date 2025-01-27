import { InvalidDataException } from '../../../../@share/exceptions/InvalidDataException';
import { genUUID } from '../../../../@share/utils/genUUID';

export interface InputConstructor {
  id: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface InputCreate {
  email: string;
  password: string;
}

export class User {
  private id: string;
  private email: string;
  private password: string;
  private createdAt?: Date;
  private updatedAt?: Date;
  private deletedAt?: Date;

  constructor({
    id,
    email,
    password,
    createdAt,
    updatedAt,
    deletedAt,
  }: InputConstructor) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  public static create({ email, password }: InputCreate): User {
    const user = new User({ id: genUUID(), email, password });

    user.isValid();

    return user;
  }

  public isValid() {
    if (!this.id) {
      throw new InvalidDataException('Id is required');
    }

    if (!this.email) {
      throw new InvalidDataException('Email is required');
    }

    if (!this.password) {
      throw new InvalidDataException('Password is required');
    }
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  public getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }
}
