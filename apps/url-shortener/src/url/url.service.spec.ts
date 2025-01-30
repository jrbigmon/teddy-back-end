import { Url } from './domain/url.entity';
import { UrlDeleteInputDTO } from './dto/url-delete.dto';
import { UrlGetInputDTO } from './dto/url-get-dto';
import { UrlListInputDTO } from './dto/url-list.dto';
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

  describe('list', () => {
    it('should be return a list of urls with count successfully', async () => {
      const url1 = new Url({
        id: '1',
        originalUrl: 'https://ola.mundo.com',
        shortUrl: Url.generateShortUrl('https://ola.mundo.com', serverUrl),
        userId: 'testUserId',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const url2 = new Url({
        id: '2',
        originalUrl: 'https://ola.mundo2.com',
        shortUrl: Url.generateShortUrl('https://ola.mundo2.com', serverUrl),
        userId: 'testUserId',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      url1.click();
      url1.click();

      await repository.save(url1);

      await repository.save(url2);

      const input: UrlListInputDTO = {
        userId: 'testUserId',
        page: 0,
        pageSize: 10,
        baseUrl: serverUrl,
      };

      const output = await urlService.list(input);

      expect(output).toMatchObject({
        count: 2,
        totalPages: 1,
        page: 0,
        pageSize: 10,
        sort: 'DESC',
        _nextPage: expect.any(String),
        _prevPage: null,
        data: [
          {
            id: '1',
            originalUrl: url1.getOriginalUrl(),
            shortUrl: url1.getShortUrl(),
            clickCount: 2,
            createdAt: url1.getCreatedAt(),
            updatedAt: url1.getUpdatedAt(),
            _infoPage: `${serverUrl}/${url1.getId()}`,
          },
          {
            id: '2',
            originalUrl: url2.getOriginalUrl(),
            shortUrl: url2.getShortUrl(),
            clickCount: 0,
            createdAt: url2.getCreatedAt(),
            updatedAt: url2.getUpdatedAt(),
            _infoPage: `${serverUrl}/${url2.getId()}`,
          },
        ],
      });
    });

    it('should be return a list of urls without count successfully', async () => {
      const url1 = new Url({
        id: '1',
        originalUrl: 'https://ola.mundo.com',
        shortUrl: Url.generateShortUrl('https://ola.mundo.com', serverUrl),
        userId: 'testUserId',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const url2 = new Url({
        id: '2',
        originalUrl: 'https://ola.mundo2.com',
        shortUrl: Url.generateShortUrl('https://ola.mundo2.com', serverUrl),
        userId: 'testUserId',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      url1.click();
      url1.click();

      await repository.save(url1);

      await repository.save(url2);

      const input: UrlListInputDTO = {
        userId: null,
        page: 0,
        pageSize: 10,
        baseUrl: serverUrl,
      };

      const output = await urlService.list(input);

      expect(output).toMatchObject({
        count: 2,
        totalPages: 1,
        page: 0,
        pageSize: 10,
        sort: 'DESC',
        _nextPage: expect.any(String),
        _prevPage: null,
        data: [
          {
            id: '1',
            originalUrl: url1.getOriginalUrl(),
            shortUrl: url1.getShortUrl(),
            clickCount: null,
            createdAt: url1.getCreatedAt(),
            updatedAt: url1.getUpdatedAt(),
            _infoPage: `${serverUrl}/${url1.getId()}`,
          },
          {
            id: '2',
            originalUrl: url2.getOriginalUrl(),
            shortUrl: url2.getShortUrl(),
            clickCount: null,
            createdAt: url2.getCreatedAt(),
            updatedAt: url2.getUpdatedAt(),
            _infoPage: `${serverUrl}/${url2.getId()}`,
          },
        ],
      });
    });
  });

  describe('get', () => {
    it('should be return a url successfully', async () => {
      const url = new Url({
        id: '1',
        originalUrl: 'https://ola.mundo.com',
        shortUrl: Url.generateShortUrl('https://ola.mundo.com', serverUrl),
        userId: 'testUserId',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      url.click();

      await repository.save(url);

      const input: UrlGetInputDTO = {
        id: '1',
        userId: 'testUserId',
      };

      const output = await urlService.get(input);

      expect(output).toMatchObject({
        id: '1',
        originalUrl: url.getOriginalUrl(),
        shortUrl: url.getShortUrl(),
        clickCount: 1,
        createdAt: url.getCreatedAt(),
        updatedAt: url.getUpdatedAt(),
      });
    });
  });
});
