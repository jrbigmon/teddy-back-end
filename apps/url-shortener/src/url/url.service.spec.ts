import { Url } from './domain/url.entity';
import { UrlDeleteInputDTO } from './dto/url-delete.dto';
import { UrlShortenerInputDTO } from './dto/url-shortener.dto';
import { UrlUpdateInputDTO } from './dto/url-update.dto';
import { UrlInMemoryRepository } from './repository/url-in-memory.repository';
import { UrlRepositoryInterface } from './repository/url.repository.interface';
import { UrlService } from './url.service';

const serverUrl = 'http://localhost:3000';

describe('UrlService unit tests', () => {
  let urlService: UrlService = null;
  let repository: UrlRepositoryInterface = null;

  beforeEach(() => {
    repository = new UrlInMemoryRepository();
    urlService = new UrlService(repository);
  });

  describe('urlShortener', () => {
    it('should be create a short url', async () => {
      const input: UrlShortenerInputDTO = {
        url: 'https://www.example.com',
        serverUrl: 'http://localhost:3000',
        userId: 'testUserId',
      };

      const output = await urlService.urlShortener(input);
      const urlSaved = await repository.get(output.id);

      expect(output).toMatchObject({
        id: expect.any(String),
        shortUrl: expect.any(String),
        createdAt: expect.any(Date),
      });
      expect(urlSaved).toMatchObject({
        originalUrl: input.url,
        shortUrl: output.shortUrl,
        userId: input.userId,
      });
    });

    it('should be reject when the original url already exists', async () => {
      jest
        .spyOn(repository, 'getOne')
        .mockResolvedValue(
          new Url({ id: '123', originalUrl: 'test', shortUrl: 'test' }),
        );

      const input: UrlShortenerInputDTO = {
        url: 'https://www.example.com',
        serverUrl: 'http://localhost:3000',
        userId: 'testUserId',
      };

      await expect(() => urlService.urlShortener(input)).rejects.toThrow(
        'Url already shortened',
      );
    });

    it('should be reject when the short url already exists', async () => {
      jest
        .spyOn(repository, 'getOne')
        .mockResolvedValue(
          new Url({ id: '123', originalUrl: 'test', shortUrl: 'test' }),
        );

      const input: UrlShortenerInputDTO = {
        url: 'https://www.example.com',
        serverUrl: 'http://localhost:3000',
        userId: 'testUserId',
      };

      await expect(() => urlService.urlShortener(input)).rejects.toThrow(
        'Url already shortened',
      );
    });
  });

  describe('update', () => {
    it('should be update the url successfully', async () => {
      await repository.save(
        new Url({
          id: '123',
          originalUrl: 'https://ola.mundo.com',
          shortUrl: Url.generateShortUrl('https://ola.mundo.com', serverUrl),
          userId: 'testUserId',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }),
      );

      const input: UrlUpdateInputDTO = {
        id: '123',
        url: 'https://www.example.com',
        userId: 'testUserId',
        serverUrl,
      };

      await urlService.update(input);

      const urlSaved = await repository.get(input.id);

      expect(urlSaved).toMatchObject({
        id: input.id,
        originalUrl: input.url,
        userId: input.userId,
        shortUrl: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      });
    });

    it('should be reject when the url not exists', async () => {
      const input: UrlUpdateInputDTO = {
        id: '123',
        url: 'https://www.example.com',
        userId: 'testUserId',
        serverUrl,
      };

      await expect(() => urlService.update(input)).rejects.toThrow(
        'Url not found',
      );
    });

    it('should be reject when the user is unauthorized', async () => {
      await repository.save(
        new Url({
          id: '123',
          originalUrl: 'https://ola.mundo.com',
          shortUrl: Url.generateShortUrl('https://ola.mundo.com', serverUrl),
          userId: 'testUserId',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }),
      );

      const input: UrlUpdateInputDTO = {
        id: '123',
        url: 'https://www.example.com',
        userId: 'wrongUserId',
        serverUrl,
      };

      await expect(urlService.update(input)).rejects.toThrow('Unauthorized');
    });

    it('should be reject when the url already exists to another user', async () => {
      await repository.save(
        new Url({
          id: '123',
          originalUrl: 'https://www.example.com',
          shortUrl: Url.generateShortUrl('https://www.example.com', serverUrl),
          userId: 'anotherUserId',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }),
      );

      await repository.save(
        new Url({
          id: '123456',
          originalUrl: 'https://ola.mundo.com',
          shortUrl: Url.generateShortUrl('https://ola.mundo.com', serverUrl),
          userId: 'testUserId',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }),
      );

      const input: UrlUpdateInputDTO = {
        id: '123456',
        url: 'https://www.example.com',
        userId: 'testUserId',
        serverUrl,
      };

      await expect(urlService.update(input)).rejects.toThrow(
        'Url already shortened',
      );
    });
  });

  describe('delete', () => {
    it('should be delete a url successfully', async () => {
      await repository.save(
        new Url({
          id: '123',
          originalUrl: 'https://ola.mundo.com',
          shortUrl: Url.generateShortUrl('https://ola.mundo.com', serverUrl),
          userId: 'testUserId',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }),
      );

      const input: UrlDeleteInputDTO = {
        id: '123',
        userId: 'testUserId',
      };

      await urlService.delete(input);

      const urlSaved = await repository.get(input.id);

      expect(urlSaved.getDeletedAt()).not.toBeNull();
    });

    it('should be reject when url not exists', async () => {
      const input: UrlDeleteInputDTO = {
        id: '123',
        userId: 'testUserId',
      };

      await expect(() => urlService.delete(input)).rejects.toThrow(
        'Url not found',
      );
    });

    it('should be reject when the user is unauthorized', async () => {
      await repository.save(
        new Url({
          id: '123',
          originalUrl: 'https://ola.mundo.com',
          shortUrl: Url.generateShortUrl('https://ola.mundo.com', serverUrl),
          userId: 'testUserId',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }),
      );

      const input: UrlDeleteInputDTO = {
        id: '123',
        userId: 'wrongUserId',
      };

      await expect(urlService.delete(input)).rejects.toThrow('Unauthorized');
    });
  });
});
