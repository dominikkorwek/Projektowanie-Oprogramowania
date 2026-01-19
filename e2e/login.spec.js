const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');

describe('E2E: Moduł Logowania', function() {
  let driver;
  const baseUrl = 'http://localhost:5173'; 

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('Powinien wyświetlić błąd przy próbie zalogowania bez danych', async function() {
    await driver.get(baseUrl);
  
    await driver.findElement(By.className('login-submit')).click();
    
    const errorMsg = await driver.wait(until.elementLocated(By.className('login-error')), 2000);
    expect(await errorMsg.getText()).to.include('login nie może być pusty');
  });

  it('Powinien wyświetlić błąd przy błędnych danych', async function() {
    await driver.get(baseUrl);
    
    await driver.findElement(By.xpath("//input[@placeholder='Login']")).sendKeys('zly_user');
    await driver.findElement(By.xpath("//input[@placeholder='Hasło']")).sendKeys('zle_haslo');
    await driver.findElement(By.className('login-submit')).click();
    
    const errorMsg = await driver.wait(until.elementLocated(By.className('login-error')), 5000);
    expect(await errorMsg.getText()).to.include('Niepoprawny login lub hasło');
  });

  it('Powinien pomyślnie zalogować po podaniu poprawnych danych', async function() {
    await driver.get(baseUrl);
    
    await driver.findElement(By.xpath("//input[@placeholder='Login']")).sendKeys('test');
    await driver.findElement(By.xpath("//input[@placeholder='Hasło']")).sendKeys('test');
    await driver.findElement(By.className('login-submit')).click();
    
    const mainMenuTitle = await driver.wait(until.elementLocated(By.className('title')), 5000);
    expect(await mainMenuTitle.getText()).to.equal('MOO METER');
  });
});