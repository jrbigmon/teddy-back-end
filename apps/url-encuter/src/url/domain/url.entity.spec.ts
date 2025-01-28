import { Url } from './url.entity';

describe('UrlEntity', () => {
  it('should be create a short url', () => {
    const originalUrl = 'https://www.example.com';
    const shortUrl = Url.generateShortUrl(originalUrl);

    expect(shortUrl).toBeDefined();
    expect(shortUrl.length).toBeGreaterThanOrEqual(6);
  });

  it('should be create a new url and shot it', () => {
    const originalUrl = 'https://www.example.com';

    const url = Url.create({
      originalUrl,
      userId: 'testUserId',
      shortUrl: Url.generateShortUrl(originalUrl),
    });

    expect(url).toMatchObject({
      originalUrl,
      userId: 'testUserId',
      shortUrl: expect.any(String),
    });
  });

  it('should be save the click when is clicked in the url', () => {
    const url = Url.create({
      originalUrl: 'https://www.example.com',
      userId: 'testUserId',
      shortUrl: Url.generateShortUrl('https://www.example.com'),
    });

    url.click('testClickUserId');
    url.click('testClickUserId');

    expect(url.getClicks()).toHaveLength(2);
    expect(url.getClicks()).toMatchObject([
      {
        id: expect.any(String),
        urlId: url.getId(),
        userId: 'testClickUserId',
      },
      {
        id: expect.any(String),
        urlId: url.getId(),
        userId: 'testClickUserId',
      },
    ]);
  });

  it('should be reject when the original is not provided', () => {
    expect(() => {
      Url.create({
        userId: 'testUserId',
        shortUrl: 'testShortUrl',
        originalUrl: null,
      });
    }).toThrow('Original URL is required');
  });

  it('should be reject when the short is not provided', () => {
    expect(() => {
      Url.create({
        userId: 'testUserId',
        originalUrl: 'testOriginalUrl',
        shortUrl: null,
      });
    }).toThrow('Short URL is required');
  });
});
