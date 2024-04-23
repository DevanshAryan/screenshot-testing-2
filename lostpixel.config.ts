export const config = {
  pageShots: {
    pages: [
      { path: '/pricing/customer-service/', name: 'pricing-customer-service' },
      { path: '/pricing/social-media-management/', name: 'pricing-social-media-management' },
      { path: '/pricing/consumer-intelligence', name: 'pricing-consumer-intelligence' },
      { path: '/pricing/marketing-and-advertising', name: 'pricing-marketing-and-advertising' },
    ],
    baseUrl: process.env.TARGET_URL || 'https://www.sprinklr.com',
  },
  imagePathBaseline: '.next/static/.lostpixel/baseline',
  imagePathCurrent: '.next/static/.lostpixel/current',
  imagePathDifference: '.next/static/.lostpixel/difference',
  generateOnly: true,
  failOnDifference: false,
  compareEngine: 'odiff',
  beforeScreenshot: async (page: any) => {
    const scrollPage = async (args: any) => {
      const { direction, speed } = args;
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      const scrollHeight = () => document.body.scrollHeight;
      const start = direction === 'down' ? 0 : scrollHeight();
      const shouldStop = (position: number) => (direction === 'down' ? position > scrollHeight() : position < 0);
      const increment = direction === 'down' ? 100 : -100;
      const delayTime = speed === 'slow' ? 50 : 10;

      let i = start;

      const scrollStep = async () => {
        if (!shouldStop(i)) {
          window.scrollTo(0, i);
          i += increment;
          await delay(delayTime);
          await scrollStep();
        }
      };

      await scrollStep();
    };
    await page.evaluate(scrollPage, { direction: 'down', speed: 'slow' });
    await page.evaluate(scrollPage, { direction: 'up', speed: 'fast' });
  },
};
