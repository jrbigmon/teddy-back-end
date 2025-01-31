import { Entity } from '../../../../@share/entity/entity';
import { InvalidDataException } from '../../../../@share/exceptions/invalid-data.expcetion';
import { genUUID } from '../../../../@share/utils/genUUID';

export interface InputConstructor {
  id: string;
  urlId: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface InputCreate {
  urlId: string;
  userId?: string;
}

export class Click implements Entity {
  private id: string;
  private urlId: string;
  private userId?: string;
  private createdAt?: Date;
  private updatedAt?: Date;
  private deletedAt?: Date;

  constructor({
    id,
    urlId,
    userId,
    createdAt,
    updatedAt,
    deletedAt,
  }: InputConstructor) {
    this.id = id;
    this.urlId = urlId;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  public static create({ urlId, userId }: InputCreate): Click {
    const currentDate = new Date();

    const click = new Click({
      id: genUUID(),
      urlId,
      userId,
      createdAt: currentDate,
      updatedAt: currentDate,
      deletedAt: null,
    });

    click.isValid();

    return click;
  }

  isValid(): void {
    if (!this.id) {
      throw new InvalidDataException('Id is required');
    }

    if (!this.urlId) {
      throw new InvalidDataException('Url ID is required');
    }
  }

  public getId(): string {
    return this.id;
  }

  public getUrlId(): string {
    return this.urlId;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  public getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }
}
