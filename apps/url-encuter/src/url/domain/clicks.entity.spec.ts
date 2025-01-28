import { Click } from './clicks.entity';

describe('ClickEntity', () => {
  it('should be create a new click', () => {
    const click = Click.create({
      urlId: 'testUrlId',
      userId: 'testUserId',
    });

    expect(click).toMatchObject({
      id: expect.any(String),
      urlId: 'testUrlId',
      userId: 'testUserId',
    });
  });

  it('should be reject when the url id is not provided', () => {
    expect(() => {
      Click.create({
        urlId: null,
        userId: 'testUserId',
      });
    }).toThrow('Url ID is required');
  });
});
