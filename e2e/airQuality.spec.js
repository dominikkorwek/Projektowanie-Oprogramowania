const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('E2E: Moduł Jakości Powietrza', function() {
  let driver;
  const baseUrl = 'http://localhost:5173'; 
  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('Powinien załadować dane i wyświetlić statyczne AQI', async function() {
    await driver.get(baseUrl + '/air-quality'); 
    
    const aqiCard = await driver.wait(until.elementLocated(By.className('aqi-value')), 5000);
    expect(await aqiCard.getText()).to.equal('AQI 45'); 
  });

  it('Powinien wyświetlić listę czujników pobraną z API', async function() {
    await driver.get(baseUrl + '/air-quality');
    
   
    const sensorButtons = await driver.wait(until.elementsLocated(By.className('sensor-item')), 5000);
    expect(sensorButtons.length).to.be.greaterThan(0);
  });

  it('Powinien przełączać zakresy czasowe trendu', async function() {
    await driver.get(baseUrl + '/air-quality');
    
    const sevenDaysBtn = await driver.findElement(By.xpath("//button[text()='7 dni']"));
    await sevenDaysBtn.click();
    

    const trendHeader = await driver.findElement(By.className('trend-header'));
    expect(await trendHeader.getText()).to.include('7 dni');
  });

  it('Powinien wrócić do menu po kliknięciu Wróć', async function() {
    await driver.get(baseUrl + '/air-quality');
    
    await driver.findElement(By.className('back')).click();
    
 
    const mainMenuTitle = await driver.wait(until.elementLocated(By.className('title')), 5000);
    expect(await mainMenuTitle.getText()).to.equal('MOO METER');
  });
});