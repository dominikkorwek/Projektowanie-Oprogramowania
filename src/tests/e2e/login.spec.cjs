const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

describe('E2E: Moduł Logowania', function() {
  let driver;
  const baseUrl = 'http://localhost:5173'; 

  this.timeout(120000);

  before(async function() {
    this.timeout(120000);
    
    try {
      const service = new chrome.ServiceBuilder(chromedriver.path);
      const options = new chrome.Options();
      options.addArguments('--no-sandbox', '--disable-dev-shm-usage');
      
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();
      
      // Set implicit wait
      await driver.manage().setTimeouts({ implicit: 10000 });
    } catch (err) {
      console.error('Error starting ChromeDriver:', err);
      throw err;
    }
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('Powinien wyświetlić błąd przy próbie zalogowania bez danych', async function() {
    await driver.get(baseUrl);
    
    
    const loginBtn = await driver.wait(
      until.elementLocated(By.className('login-button')),
      15000
    );
    await loginBtn.click();
    
   
    const submitBtn = await driver.wait(
      until.elementLocated(By.className('login-submit')),
      10000
    );
    await submitBtn.click();
    
  
    const errorMsg = await driver.wait(
      until.elementLocated(By.className('login-error')),
      10000
    );
    const errorText = await errorMsg.getText();
    expect(errorText).to.include('login nie może być pusty');
  });

  it('Powinien wyświetlić błąd przy błędnych danych', async function() {
    await driver.get(baseUrl);
    
  
    const loginBtn = await driver.wait(
      until.elementLocated(By.className('login-button')),
      15000
    );
    await loginBtn.click();
    
    
    const loginInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Login']")),
      10000
    );
    const passwordInput = await driver.findElement(By.xpath("//input[@placeholder='Hasło']"));
    const submitBtn = await driver.findElement(By.className('login-submit'));
    
 
    await loginInput.sendKeys('zly_user');
    await passwordInput.sendKeys('zle_haslo');
    await submitBtn.click();
    
   
    const errorMsg = await driver.wait(
      until.elementLocated(By.className('login-error')),
      10000
    );
    const errorText = await errorMsg.getText();
    expect(errorText).to.include('Niepoprawny login lub hasło');
  });

  it('Powinien pomyślnie zalogować po podaniu poprawnych danych', async function() {
    await driver.get(baseUrl);
    

    const loginBtn = await driver.wait(
      until.elementLocated(By.className('login-button')),
      15000
    );
    await loginBtn.click();
    
    
    const loginInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Login']")),
      10000
    );
    const passwordInput = await driver.findElement(By.xpath("//input[@placeholder='Hasło']"));
    const submitBtn = await driver.findElement(By.className('login-submit'));
    
    
    await loginInput.sendKeys('test');
    await passwordInput.sendKeys('test');
    await submitBtn.click();
    
   
    const mainMenuTitle = await driver.wait(
      until.elementLocated(By.className('title')),
      10000
    );
    const titleText = await mainMenuTitle.getText();
    expect(titleText).to.equal('MOO METER');
  });
});