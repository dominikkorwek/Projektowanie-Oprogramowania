const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('E2E: Moduł Diagnostyki Czujników', function() {
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

  async function navigateToDiagnostics() {
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('Diagnostyka czujników'));
      },
      { timeout: 10000 }
    );
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const diagnosticsBtn = buttons.find(btn => btn.textContent.includes('Diagnostyka czujników'));
      diagnosticsBtn.click();
    });
  }

  it('Powinien zainicjalizować moduł diagnostyki i wyświetlić dane czujników oraz historię testów', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Step 1: Login to application
    await login();
    
    // Step 2: Navigate to "Diagnostyka czujników" section
    await navigateToDiagnostics();
    
    // Step 3: Verify header displays "MooMeter"
    await page.waitForSelector('.header-title', { timeout: 10000 });
    const headerTitle = await page.$eval('.header-title', el => el.textContent);
    expect(headerTitle).to.equal('MooMeter');
    
    // Step 4: Verify section title "Diagnostyka czujników"
    await page.waitForSelector('.section-title', { timeout: 10000 });
    const sectionTitle = await page.$eval('.section-title', el => el.textContent);
    expect(sectionTitle).to.include('Diagnostyka czujników');
    
    // Step 5-6: Wait for sensor list to load and verify all sensor types display correctly
    await page.waitForSelector('.sensor-row', { timeout: 10000 });
    const sensorRows = await page.$$('.sensor-row');
    expect(sensorRows.length).to.be.greaterThan(0);
    
    // Verify each row has sensor name
    const sensorNames = await page.$$eval('.sensor-name', elements => 
      elements.map(el => el.textContent)
    );
    expect(sensorNames.length).to.be.greaterThan(0);
    
    // Step 7: Verify test history section displays entries
    await page.waitForSelector('.history-row', { timeout: 10000 });
    const historyRows = await page.$$('.history-row');
    expect(historyRows.length).to.be.greaterThan(0);
    
    // Verify entries have dates
    const historyDates = await page.$$eval('.history-date', elements => 
      elements.map(el => el.textContent)
    );
    expect(historyDates.length).to.be.greaterThan(0);
    
    // Verify entries have error types
    const historyTypes = await page.$$eval('.history-type', elements => 
      elements.map(el => el.textContent)
    );
    expect(historyTypes.length).to.be.greaterThan(0);
    
    // Verify entries have status buttons
    const historyStatusButtons = await page.$$('.history-row .status-button');
    expect(historyStatusButtons.length).to.be.greaterThan(0);
    
    // Step 8: Verify "Uruchom" button is visible and active
    await page.waitForSelector('.run-button', { timeout: 5000 });
    const runButtonText = await page.$eval('.run-button', el => el.textContent);
    expect(runButtonText).to.equal('Uruchom');
    
    const runButtonDisabled = await page.$eval('.run-button', el => el.disabled);
    expect(runButtonDisabled).to.be.false;
  });

  it('Powinien uruchomić diagnostykę czujników i zaktualizować wyniki', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Step 1: Login and navigate to diagnostics
    await login();
    await navigateToDiagnostics();
    
    // Wait for initial load
    await page.waitForSelector('.history-row', { timeout: 10000 });
    
    // Step 2: Get initial history entry count
    const initialHistoryCount = await page.$$eval('.history-row', elements => elements.length);
    
    // Step 3: Click "Uruchom" button
    await page.waitForSelector('.run-button', { timeout: 5000 });
    await page.click('.run-button');
    
    // Step 4: Verify diagnostics starts immediately
    await sleep(100); // Small delay to allow state to update
    
    // Button text changes to "Trwa diagnozowanie"
    const buttonTextDuring = await page.$eval('.run-button', el => el.textContent);
    expect(buttonTextDuring).to.equal('Trwa diagnozowanie');
    
    // Button becomes disabled
    const buttonDisabledDuring = await page.$eval('.run-button', el => el.disabled);
    expect(buttonDisabledDuring).to.be.true;
    
    // Button has .diagnosing class
    const buttonHasDiagnosingClass = await page.$eval('.run-button', el => 
      el.classList.contains('diagnosing')
    );
    expect(buttonHasDiagnosingClass).to.be.true;
    
    // Step 5: Wait for diagnostics to complete
    await page.waitForFunction(
      () => {
        const button = document.querySelector('.run-button');
        return button && button.textContent === 'Uruchom' && !button.disabled;
      },
      { timeout: 15000 }
    );
    
    // Verify button text returns to "Uruchom"
    const buttonTextAfter = await page.$eval('.run-button', el => el.textContent);
    expect(buttonTextAfter).to.equal('Uruchom');
    
    // Verify button is re-enabled
    const buttonDisabledAfter = await page.$eval('.run-button', el => el.disabled);
    expect(buttonDisabledAfter).to.be.false;
    
    // Step 6: Verify new entry appears in history
    await sleep(500); // Allow DOM to update
    
    const newHistoryCount = await page.$$eval('.history-row', elements => elements.length);
    expect(newHistoryCount).to.equal(initialHistoryCount + 1);
    
    // Verify new entry is at the top (most recent)
    const firstHistoryDate = await page.$eval('.history-row:first-child .history-date', el => el.textContent);
    expect(firstHistoryDate).to.exist;
    
    // Verify new entry has status
    const firstHistoryStatus = await page.$('.history-row:first-child .status-button');
    expect(firstHistoryStatus).to.exist;
    
    // Step 7: Run diagnostics again to verify it can be repeated
    await page.click('.run-button');
    
    // Verify button changes to "Trwa diagnozowanie"
    await sleep(100);
    const buttonTextSecondRun = await page.$eval('.run-button', el => el.textContent);
    expect(buttonTextSecondRun).to.equal('Trwa diagnozowanie');
    
    // Wait for completion
    await page.waitForFunction(
      () => {
        const button = document.querySelector('.run-button');
        return button && button.textContent === 'Uruchom' && !button.disabled;
      },
      { timeout: 15000 }
    );
    
    // Verify another new entry added to history
    await sleep(500);
    const finalHistoryCount = await page.$$eval('.history-row', elements => elements.length);
    expect(finalHistoryCount).to.equal(initialHistoryCount + 2);
  });
});
