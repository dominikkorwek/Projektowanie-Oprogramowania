const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('E2E: Moduł Nagłówka (Header)', function() {
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

  it('Powinien zweryfikować proces synchronizacji danych (sukces i błąd)', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Step 1: Login and navigate to any functionality
    await login();
    await navigateToDiagnostics();
    
    // Verify header displays "MooMeter" title
    await page.waitForSelector('.header-title', { timeout: 10000 });
    const headerTitle = await page.$eval('.header-title', el => el.textContent);
    expect(headerTitle).to.equal('MooMeter');
    
    // Verify sync button exists
    await page.waitForSelector('.sync-status', { timeout: 10000 });
    
    // Step 2: Observe sync status for first ~1s - should show "Synchronizacja rozpoczęta"
    await sleep(500); // Give it a moment to initialize
    const syncTextStarted = await page.$eval('.sync-status', el => el.textContent.trim());
    expect(syncTextStarted).to.include('Synchronizacja rozpoczęta');
    
    // Step 3: Observe next ~1.5s - should change to "Przesyłanie danych", then only spinner
    await sleep(1000); // Wait to reach 'sending' state
    const syncTextSending = await page.$eval('.sync-status', el => el.textContent.trim());
    expect(syncTextSending).to.include('Przesyłanie danych');
    
    // Wait for loading state (only spinner, no text)
    await sleep(1000); // Wait to reach 'loading' state
    const syncTextLoading = await page.$eval('.sync-status', el => el.textContent.trim());
    // Loading state should only have the sync icon, no additional text
    expect(syncTextLoading).to.not.include('Synchronizacja');
    expect(syncTextLoading).to.not.include('Przesyłanie');
    
    // Step 4: Wait for completion (~3.5s total) - should finish with success or error
    await sleep(1500); // Wait for final state
    
    // Check if sync completed (button should be clickable now)
    const isSyncClickable = await page.$eval('.sync-status', el => 
      el.classList.contains('clickable')
    );
    expect(isSyncClickable).to.be.true;
    
    // Verify it's either success or error state
    const finalState = await page.$eval('.sync-status', el => {
      if (el.classList.contains('sync-success')) return 'success';
      if (el.classList.contains('sync-error')) return 'error';
      return 'unknown';
    });
    expect(['success', 'error']).to.include(finalState);
    
    // Step 5: Verify button is not disabled after completion
    const isButtonDisabled = await page.$eval('.sync-status', el => el.disabled);
    expect(isButtonDisabled).to.be.false;
    
    // If error state, verify error message is displayed
    if (finalState === 'error') {
      const errorText = await page.$eval('.sync-status', el => el.textContent.trim());
      expect(errorText).to.include('Błąd synchronizacji');
    }
  });

  it('Powinien umożliwić restart synchronizacji po jej zakończeniu', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Login and navigate to any functionality
    await login();
    await navigateToDiagnostics();
    
    // Step 1: Wait for initial automatic synchronization to complete
    await page.waitForSelector('.sync-status', { timeout: 10000 });
    
    // Wait for sync to complete (button becomes clickable)
    await page.waitForFunction(
      () => {
        const syncBtn = document.querySelector('.sync-status');
        return syncBtn && syncBtn.classList.contains('clickable');
      },
      { timeout: 15000 }
    );
    
    // Verify button is active
    const isClickableBeforeRestart = await page.$eval('.sync-status', el => 
      el.classList.contains('clickable')
    );
    expect(isClickableBeforeRestart).to.be.true;
    
    // Step 2: Click sync button to restart synchronization
    await page.click('.sync-status');
    
    // Step 3: Verify sync restarts and shows "Synchronizacja rozpoczęta"
    await sleep(200); // Brief delay for state update
    const syncTextAfterClick = await page.$eval('.sync-status', el => el.textContent.trim());
    expect(syncTextAfterClick).to.include('Synchronizacja rozpoczęta');
    
    // Verify button is no longer clickable during sync
    const isClickableDuringSync = await page.$eval('.sync-status', el => 
      el.classList.contains('clickable')
    );
    expect(isClickableDuringSync).to.be.false;
    
    // Step 4: Verify full cycle progression through all states
    // Check 'started' state
    let currentText = await page.$eval('.sync-status', el => el.textContent.trim());
    expect(currentText).to.include('Synchronizacja rozpoczęta');
    
    // Wait and check 'sending' state (occurs at ~1s)
    await sleep(1100);
    currentText = await page.$eval('.sync-status', el => el.textContent.trim());
    expect(currentText).to.include('Przesyłanie danych');
    
    // Wait and check 'loading' state (occurs at ~2.5s from start)
    await sleep(1500);
    currentText = await page.$eval('.sync-status', el => el.textContent.trim());
    expect(currentText).to.not.include('Synchronizacja');
    expect(currentText).to.not.include('Przesyłanie');
    
    // Wait for completion
    await page.waitForFunction(
      () => {
        const syncBtn = document.querySelector('.sync-status');
        return syncBtn && syncBtn.classList.contains('clickable');
      },
      { timeout: 10000 }
    );
    
    // Verify sync completed (success or error)
    const finalState = await page.$eval('.sync-status', el => {
      if (el.classList.contains('sync-success')) return 'success';
      if (el.classList.contains('sync-error')) return 'error';
      return 'unknown';
    });
    expect(['success', 'error']).to.include(finalState);
    
    // Verify button is clickable again
    const isClickableAfterCompletion = await page.$eval('.sync-status', el => 
      el.classList.contains('clickable')
    );
    expect(isClickableAfterCompletion).to.be.true;
  });

  it('Powinien zablokować kliknięcia przycisku synchronizacji podczas trwania procesu', async function() {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Login and navigate to any functionality
    await login();
    await navigateToDiagnostics();
    
    // Wait for sync button to appear
    await page.waitForSelector('.sync-status', { timeout: 10000 });
    
    // During initial sync, button should be disabled
    await sleep(500);
    
    // Try to click button during synchronization
    const wasClickableDuringSync = await page.$eval('.sync-status', el => 
      el.classList.contains('clickable')
    );
    
    // Button should NOT be clickable during sync
    expect(wasClickableDuringSync).to.be.false;
    
    // Verify button is disabled
    const isDisabledDuringSync = await page.$eval('.sync-status', el => el.disabled);
    expect(isDisabledDuringSync).to.be.true;
    
    // Wait for sync to complete
    await page.waitForFunction(
      () => {
        const syncBtn = document.querySelector('.sync-status');
        return syncBtn && syncBtn.classList.contains('clickable');
      },
      { timeout: 15000 }
    );
    
    // After completion, button should be enabled
    const isDisabledAfterSync = await page.$eval('.sync-status', el => el.disabled);
    expect(isDisabledAfterSync).to.be.false;
    
    // Restart sync
    await page.click('.sync-status');
    await sleep(200);
    
    // During restarted sync, button should again be disabled
    const isDisabledDuringRestart = await page.$eval('.sync-status', el => el.disabled);
    expect(isDisabledDuringRestart).to.be.true;
  });
});
