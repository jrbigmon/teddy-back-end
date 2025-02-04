import { Url } from './url.entity';

describe('UrlEntity', () => {
  const serverUrl = 'http://localhost:3000';

  it('should be create a short url', () => {
    const originalUrl = 'https://www.example.com';
    const shortUrl = Url.generateShortUrl(originalUrl, serverUrl);

    expect(shortUrl).toBeDefined();
    expect(shortUrl.length).toBeGreaterThanOrEqual(6);
  });

  it('should be create a new url and shot it', () => {
    const originalUrl = 'https://www.example.com';

    const url = Url.create({
      originalUrl,
      userId: 'testUserId',
      shortUrl: Url.generateShortUrl(originalUrl, serverUrl),
    });

    expect(url).toMatchObject({
      originalUrl,
      userId: 'testUserId',
      shortUrl: expect.any(String),
    });

    expect(url.getShortUrl().startsWith(serverUrl)).toBeTruthy();
  });

  it('should be save the click when is clicked in the url', () => {
    const url = Url.create({
      originalUrl: 'https://www.example.com',
      userId: 'testUserId',
      shortUrl: Url.generateShortUrl('https://www.example.com', serverUrl),
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

  it('should be create some url shorts and theses not matching', () => {
    const originalUrl1 = 'http://example.com/1';
    const originalUrl2 = 'http://example.com/2';
    const originalUrl3 = 'http://example.com/3';

    const urlShortener1 = Url.generateShortUrl(originalUrl1, serverUrl);
    const urlShortener2 = Url.generateShortUrl(originalUrl2, serverUrl);
    const urlShortener3 = Url.generateShortUrl(originalUrl3, serverUrl);

    expect(urlShortener1).not.toBe(urlShortener2);
    expect(urlShortener2).not.toBe(urlShortener3);
    expect(urlShortener1).not.toBe(urlShortener3);
  });
});
