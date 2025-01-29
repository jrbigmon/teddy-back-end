import { Url } from './domain/url.entity';
import { UrlShortenerInputDTO } from './dto/url-shortener.dto';
import { UrlInMemoryRepository } from './repository/url-in-memory.repository';
import { UrlRepositoryInterface } from './repository/url.repository.interface';
import { UrlService } from './url.service';

describe('UrlService unit tests', () => {
  let urlService: UrlService = null;
  let repository: UrlRepositoryInterface = null;

  beforeEach(() => {
    repository = new UrlInMemoryRepository();
    urlService = new UrlService(repository);
  });

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
