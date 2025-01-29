import { createHash } from 'node:crypto';
import { genUUID } from '../../../../@share/utils/genUUID';
import { Entity } from '../../../../@share/entity/entity';
import { Click } from './clicks.entity';

export interface InputConstructor {
  id: string;
  originalUrl: string;
  shortUrl: string;
  userId?: string;
  clicks?: Click[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface InputCreate {
  originalUrl: string;
  shortUrl: string;
  userId?: string;
}

export class Url implements Entity {
  private id: string;
  private originalUrl: string;
  private shortUrl: string;
  private userId?: string;
  private clicks: Array<Click>;
  private clickCount?: number;
  private createdAt?: Date;
  private updatedAt?: Date;
  private deletedAt?: Date;

  constructor({
    id,
    originalUrl,
    shortUrl,
    userId,
    clicks,
    createdAt,
    updatedAt,
    deletedAt,
  }: InputConstructor) {
    this.id = id;
    this.originalUrl = originalUrl;
    this.shortUrl = shortUrl;
    this.userId = userId;
    this.clicks = clicks || [];
    this.clickCount = clicks?.length ?? 0;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  public static create({ originalUrl, userId, shortUrl }: InputCreate) {
    const currentDate = new Date();

    const url = new Url({
      id: genUUID(),
      originalUrl,
      shortUrl,
      userId,
      createdAt: currentDate,
      updatedAt: currentDate,
      deletedAt: null,
    });

    url.isValid();

    return url;
  }

  public isValid() {
    if (!this.id) {
      throw new Error('Id is required');
    }

    if (!this.originalUrl) {
      throw new Error('Original URL is required');
    }

    if (!this.shortUrl) {
      throw new Error('Short URL is required');
    }
  }

  public static generateShortUrl(url: string, serverUrl: string): string {
    const hash = createHash('sha256').update(url).digest('hex');
    return `${serverUrl}/${hash.slice(0, 6)}`;
  }

  public click(userId?: string) {
    const click = Click.create({ urlId: this.getId(), userId: userId });

    this.clicks.push(click);
  }

  public getId(): string {
    return this.id;
  }
  public getOriginalUrl(): string {
    return this.originalUrl;
  }

  public setOriginalUrl(url: string) {
    this.originalUrl = url;
    this.updatedAt = new Date();
  }

  public getShortUrl(): string {
    return this.shortUrl;
  }

  public setShortUrl(shortUrl: string) {
    this.shortUrl = shortUrl;
    this.updatedAt = new Date();
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  public getClicks(): Array<Click> {
    return this.clicks;
  }

  public getClickCount(): number {
    return this.clickCount;
  }

  public setClickCount(value: number): void {
    this.clickCount = value;
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
