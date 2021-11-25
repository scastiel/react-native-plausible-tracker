import Plausible from '../src/lib/tracker';

describe('Plausible', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve(({
        text: () => 'ok',
      } as unknown) as Response)
    );
    (global as any).__DEV__ = false;
  });

  describe('init', () => {
    it('should safely intialise', () => {
      const plausible = Plausible({
        domain: 'example.com',
      });

      expect(plausible).toHaveProperty('trackEvent');
      expect(plausible).toHaveProperty('trackScreen');
    });
  });

  describe('trackEvent', () => {
    it('should track an event with defaults', async () => {
      const plausible = Plausible({
        domain: 'example.com',
      });

      await plausible.trackEvent('my-event');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://plausible.io/api/event',
        {
          body: JSON.stringify({
            n: 'my-event',
            u: '',
            d: 'example.com',
            r: null,
            w: 1337,
          }),
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'mockUserAgents',
            'X-Forwarded-For': '127.0.0.1',
          },
          method: 'POST',
        }
      );
    });
    
    it('should track an event with extra properties', async () => {
      const plausible = Plausible({
        domain: 'example.com',
      });

      await plausible.trackEvent('my-event', {
        foo: 'bar',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://plausible.io/api/event',
        expect.objectContaining({
          body: JSON.stringify({
            n: 'my-event',
            u: '',
            d: 'example.com',
            r: null,
            w: 1337,
            p: JSON.stringify({ foo: 'bar' }),
          }),
          method: 'POST',
        })
      );
    });

    it('should track an event overridden options', async () => {
      const plausible = Plausible({
        domain: 'example.com',
      });

      await plausible.trackEvent('my-event', undefined, {
        url: 'custom_url',
        referrer: 'my-referrer',
        deviceWidth: 123,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://plausible.io/api/event',
        expect.objectContaining({
          body: JSON.stringify({
            n: 'my-event',
            u: 'custom_url',
            d: 'example.com',
            r: 'my-referrer',
            w: 123,
          }),
        })
      );
    });
  });

  describe('trackScreen', () => {
    it('should track a screen with defaults', async () => {
      const plausible = Plausible({
        domain: 'example.com',
      });

      await plausible.trackScreen('my-screen');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://plausible.io/api/event',
        {
          body: JSON.stringify({
            n: 'pageview',
            u: 'app://mockBundleId/my-screen',
            d: 'example.com',
            r: null,
            w: 1337,
          }),
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'mockUserAgents',
            'X-Forwarded-For': '127.0.0.1',
          },
          method: 'POST',
        }
      );
    });
  });
});
