const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('E2E: Moduł Jakości Powietrza', function() {
  let browser;
  let page;
  const baseUrl = 'http://localhost:5173'; 
  
  this.timeout(120000);

  before(async function() {
    this.timeout(120000);
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      });
      
      page = await browser.newPage();
      page.setDefaultTimeout(10000);
    } catch (err) {
      console.error('Error starting browser:', err);
      throw err;
    }
  });

  after(async function() {
    if (browser) {
      await browser.close();
    }
  });


  async function login() {
    await page.waitForSelector('.login-button', { timeout: 15000 });
    await page.click('.login-button');
    
    await page.waitForSelector("input[placeholder='Login']", { timeout: 10000 });
    await page.type("input[placeholder='Login']", 'test');
    await page.type("input[placeholder='Hasło']", 'test');
    await page.click('.login-submit');
    
    await page.waitForSelector('.main-menu', { timeout: 15000 });
  }

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function closeAlertIfExists() {
    for (let i = 0; i < 2; i++) {
      try {
        const alertCloseBtn = await page.$('.alert-close');
        if (alertCloseBtn) {
          await alertCloseBtn.click();
          await sleep(300);
        }
      } catch (err) {
        // Ignore if alert doesn't exist
      }
    }
  }

  it('Powinien zalogować się i załadować aplikację na stronie głównej', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await login();
    
    const element = await page.waitForSelector('.main-menu', { timeout: 15000 });
    expect(element).to.exist;
  });

  it('Powinien zalogować się i przejść do modułu Jakości Powietrza', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await login();
    
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('Jakość powietrza'));
      },
      { timeout: 10000 }
    );
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const airQualityBtn = buttons.find(btn => btn.textContent.includes('Jakość powietrza'));
      airQualityBtn.click();
    });
    
    const aqiCard = await page.waitForSelector('.aqi-value', { timeout: 10000 });
    expect(aqiCard).to.exist;
  });

  it('Powinien zalogować się i wyświetlić listę czujników', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await login();
    
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('Jakość powietrza'));
      },
      { timeout: 10000 }
    );
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const airQualityBtn = buttons.find(btn => btn.textContent.includes('Jakość powietrza'));
      airQualityBtn.click();
    });
    
    await page.waitForSelector('.sensor-item', { timeout: 10000 });
    const sensorButtons = await page.$$('.sensor-item');
    expect(sensorButtons.length).to.be.greaterThan(0);
  });

  it('Powinien zalogować się i przełączać zakresy czasowe trendu', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await login();
    
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('Jakość powietrza'));
      },
      { timeout: 5000 }
    );
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const airQualityBtn = buttons.find(btn => btn.textContent.includes('Jakość powietrza'));
      airQualityBtn.click();
    });
    
    await page.waitForSelector('.aqi-value', { timeout: 5000 });
    
    await sleep(500);
    await closeAlertIfExists();
    await closeAlertIfExists();
    
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('7 dni'));
      },
      { timeout: 5000 }
    );
    await closeAlertIfExists();
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sevenDaysBtn = buttons.find(btn => btn.textContent.includes('7 dni'));
      sevenDaysBtn.click();
    });
    
    await page.waitForSelector('.trend-header', { timeout: 3000 });
    const text = await page.$eval('.trend-header', el => el.textContent);
    expect(text).to.include('7 dni');
  });

  it('Powinien zalogować się i wrócić do menu głównego', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await login();
    
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('Jakość powietrza'));
      },
      { timeout: 5000 }
    );
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const airQualityBtn = buttons.find(btn => btn.textContent.includes('Jakość powietrza'));
      airQualityBtn.click();
    });
    
    await page.waitForSelector('.aqi-value', { timeout: 5000 });
    
    await sleep(500);
    await closeAlertIfExists();
    await closeAlertIfExists();
    
    await page.waitForSelector('.back', { timeout: 3000 });
    await page.evaluate(() => {
      const backBtn = document.querySelector('.back');
      backBtn.click();
    });
    
    const mainMenu = await page.waitForSelector('.main-menu', { timeout: 3000 });
    expect(mainMenu).to.exist;
  });

  it('Powinien wyświetlić alert po wejściu do modułu Jakości Powietrza', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await login();
    
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('Jakość powietrza'));
      },
      { timeout: 5000 }
    );
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const airQualityBtn = buttons.find(btn => btn.textContent.includes('Jakość powietrza'));
      airQualityBtn.click();
    });
    
    await page.waitForSelector('.aqi-value', { timeout: 5000 });
    
    await sleep(500);
    
    const alertOverlay = await page.waitForSelector('.alert-overlay', { timeout: 3000 });
    expect(alertOverlay).to.exist;
    
    const alertCloseBtn = await page.$('.alert-close');
    expect(alertCloseBtn).to.exist;
  });
});