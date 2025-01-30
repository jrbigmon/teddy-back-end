import { Entity } from '../../../../@share/entity/entity';
import { InvalidDataException } from '../../../../@share/exceptions/invalid-data.expcetion';

export interface InputConstructor {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface InputCreate {
  name: string;
  password: string;
}

export class User implements Entity {
  private id: string;
  private name: string;
  private createdAt?: Date;
  private updatedAt?: Date;
  private deletedAt?: Date;

  constructor({ id, name, createdAt, updatedAt, deletedAt }: InputConstructor) {
    const currentDate = new Date();

    this.id = id;
    this.name = name;
    this.createdAt = createdAt ?? currentDate;
    this.updatedAt = updatedAt ?? currentDate;
    this.deletedAt = deletedAt;
  }

  public isValid() {
    if (!this.id) {
      throw new InvalidDataException('Id is required');
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
    this.updated();
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

  public updated(): void {
    this.updatedAt = new Date();
  }

  public deleted(): void {
    this.deletedAt = new Date();
  }
}
