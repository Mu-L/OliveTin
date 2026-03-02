import { describe, it, before, after } from 'mocha'
import { expect } from 'chai'
import { By, Condition } from 'selenium-webdriver'
import {
  getRootAndWait,
  takeScreenshotOnFailure,
  getTerminalBuffer,
} from '../../lib/elements.js'

describe('config: xtermLinkHandling', function () {
  before(async function () {
    await runner.start('xtermLinkHandling')
  })

  after(async () => {
    await runner.stop()
  })

  afterEach(function () {
    takeScreenshotOnFailure(this.currentTest, webdriver)
  })

  it('xterm output shows URL and link handling is configured', async function () {
    await getRootAndWait()

    await webdriver.wait(new Condition('wait for Echo URL button', async () => {
      const btns = await webdriver.findElements(By.css('[title="Echo URL"]'))
      return btns.length === 1
    }), 10000)

    const echoUrlButton = await webdriver.findElement(By.css('[title="Echo URL"]'))
    await echoUrlButton.click()

    await webdriver.wait(new Condition('wait for execution view', async () => {
      const url = await webdriver.getCurrentUrl()
      return url.includes('/logs/') && !url.endsWith('/logs')
    }), 10000)

    await webdriver.wait(new Condition('wait for execution status', async () => {
      const statusElements = await webdriver.findElements(By.id('execution-dialog-status'))
      return statusElements.length > 0
    }), 5000)

    await webdriver.wait(new Condition('wait for execution to finish', async () => {
      try {
        const statusElement = await webdriver.findElement(By.id('execution-dialog-status'))
        const statusText = await statusElement.getText()
        return !statusText.includes('Executing')
      } catch (e) {
        return false
      }
    }), 5000)

    await webdriver.sleep(500)

    const bufferText = await getTerminalBuffer()
    expect(bufferText).to.not.be.null
    expect(bufferText).to.include('https://example.com')

    const linkHandlerSet = await webdriver.executeScript(`
      try {
        return !!(window.terminal && window.terminal.linkHandlerConfigured === true)
      } catch (e) {
        return false
      }
    `)
    expect(linkHandlerSet).to.equal(true)
  })
})
