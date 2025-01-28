import { Entity } from '../../../../@share/entity/entity';
import { InvalidDataException } from '../../../../@share/exceptions/invalid-data.expcetion';
import { genUUID } from '../../../../@share/utils/genUUID';

export interface InputConstructor {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface InputCreate {
  name: string;
  email: string;
  password: string;
}

export class User implements Entity {
  private id: string;
  private name: string;
  private email: string;
  private password: string;
  private createdAt?: Date;
  private updatedAt?: Date;
  private deletedAt?: Date;

  constructor({
    id,
    email,
    name,
    password,
    createdAt,
    updatedAt,
    deletedAt,
  }: InputConstructor) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  public static create({ name, email, password }: InputCreate): User {
    const currentDate = new Date();
    const user = new User({
      id: genUUID(),
      name,
      email,
      password,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    user.isValid();

    return user;
  }

  public isValid() {
    if (!this.id) {
      throw new InvalidDataException('Id is required');
    }

    if (!this.name) {
      throw new InvalidDataException('Name is required');
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

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
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
