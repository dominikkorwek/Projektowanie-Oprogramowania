const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('E2E: Moduł Logowania', function() {
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

  it('Powinien wyświetlić błąd przy próbie zalogowania bez danych', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('.login-button', { timeout: 15000 });
    await page.click('.login-button');
    
    await page.waitForSelector('.login-submit', { timeout: 10000 });
    await page.click('.login-submit');
    
    await page.waitForSelector('.login-error', { timeout: 10000 });
    const errorText = await page.$eval('.login-error', el => el.textContent);
    expect(errorText).to.include('login nie może być pusty');
  });

  it('Powinien wyświetlić błąd przy błędnych danych', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('.login-button', { timeout: 15000 });
    await page.click('.login-button');
    
    await page.waitForSelector("input[placeholder='Login']", { timeout: 10000 });
    await page.type("input[placeholder='Login']", 'zly_user');
    await page.type("input[placeholder='Hasło']", 'zle_haslo');
    await page.click('.login-submit');
    
    await page.waitForSelector('.login-error', { timeout: 10000 });
    const errorText = await page.$eval('.login-error', el => el.textContent);
    expect(errorText).to.include('Niepoprawny login lub hasło');
  });

  it('Powinien pomyślnie zalogować po podaniu poprawnych danych', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('.login-button', { timeout: 15000 });
    await page.click('.login-button');
    
    await page.waitForSelector("input[placeholder='Login']", { timeout: 10000 });
    await page.type("input[placeholder='Login']", 'test');
    await page.type("input[placeholder='Hasło']", 'test');
    await page.click('.login-submit');
    
    await page.waitForSelector('.title', { timeout: 10000 });
    const titleText = await page.$eval('.title', el => el.textContent);
    expect(titleText).to.equal('MOO METER');
  });
});