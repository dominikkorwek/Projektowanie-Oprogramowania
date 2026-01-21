const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

describe('E2E: Moduł Jakości Powietrza', function() {
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


  async function login() {
    
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
    
    
    await driver.wait(
      until.elementLocated(By.className('main-menu')),
      15000
    );
  }

  async function closeAlertIfExists() {

    for (let i = 0; i < 2; i++) {
      try {
        const alertCloseBtn = await driver.findElement(By.className('alert-close'));
        await driver.executeScript("arguments[0].click();", alertCloseBtn);
        await driver.sleep(300);
      } catch (err) {
      
      }
    }
  }

  it('Powinien zalogować się i załadować aplikację na stronie głównej', async function() {
    await driver.get(baseUrl);
    
    
    await login();
    
    
    const element = await driver.wait(
      until.elementLocated(By.className('main-menu')),
      15000
    );
    expect(element).to.exist;
  });

  it('Powinien zalogować się i przejść do modułu Jakości Powietrza', async function() {
    await driver.get(baseUrl);
    
    
    await login();
    
   
    const airQualityBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Jakość powietrza')]")),
      10000
    );
    await airQualityBtn.click();
    
    
    const aqiCard = await driver.wait(
      until.elementLocated(By.className('aqi-value')),
      10000
    );
    expect(aqiCard).to.exist;
  });

  it('Powinien zalogować się i wyświetlić listę czujników', async function() {
    await driver.get(baseUrl);
    
    // Login first
    await login();
    
    const airQualityBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Jakość powietrza')]")),
      10000
    );
    await airQualityBtn.click();
    
    
    const sensorButtons = await driver.wait(
      until.elementsLocated(By.className('sensor-item')),
      10000
    );
    expect(sensorButtons.length).to.be.greaterThan(0);
  });

  it('Powinien zalogować się i przełączać zakresy czasowe trendu', async function() {
    await driver.get(baseUrl);
    
    await login();
    
    const airQualityBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Jakość powietrza')]")),
      5000
    );
    await airQualityBtn.click();
    
    await driver.wait(
      until.elementLocated(By.className('aqi-value')),
      5000
    );
    
    await driver.sleep(500);
    await closeAlertIfExists();
    await closeAlertIfExists();
    
    const sevenDaysBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., '7 dni')]")),
      5000
    );
    
    await closeAlertIfExists();
    await sevenDaysBtn.click();
    
    const trendHeader = await driver.wait(
      until.elementLocated(By.className('trend-header')),
      3000
    );
    const text = await trendHeader.getText();
    expect(text).to.include('7 dni');
  });

  it('Powinien zalogować się i wrócić do menu głównego', async function() {
    await driver.get(baseUrl);
    
    await login();
    
    const airQualityBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Jakość powietrza')]")),
      5000
    );
    await airQualityBtn.click();
    
    await driver.wait(
      until.elementLocated(By.className('aqi-value')),
      5000
    );
    
    await driver.sleep(500);
    await closeAlertIfExists();
    await closeAlertIfExists();
   
    const backBtn = await driver.wait(
      until.elementLocated(By.className('back')),
      3000
    );
    
    await backBtn.click();
    
    const mainMenu = await driver.wait(
      until.elementLocated(By.className('main-menu')),
      3000
    );
    expect(mainMenu).to.exist;
  });

  it('Powinien wyświetlić alert po wejściu do modułu Jakości Powietrza', async function() {
    await driver.get(baseUrl);
    
    await login();
    
    const airQualityBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Jakość powietrza')]")),
      5000
    );
    await airQualityBtn.click();
    
    await driver.wait(
      until.elementLocated(By.className('aqi-value')),
      5000
    );
    
    await driver.sleep(500);
    
    const alertOverlay = await driver.wait(
      until.elementLocated(By.className('alert-overlay')),
      3000
    );
    expect(alertOverlay).to.exist;
    
    const alertCloseBtn = await driver.findElement(By.className('alert-close'));
    expect(alertCloseBtn).to.exist;
  });
});