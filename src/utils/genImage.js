import puppeteer from 'puppeteer';

let browserInstance = null;

async function getBrowserInstance() {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-javascript',
      ],
    });
    browserInstance.on('disconnected', () => {
      browserInstance = null;
    });
  }
  return browserInstance;
}

async function genImage(data, item) {
  let page;
  try {
    const browser = await getBrowserInstance();
    page = await browser.newPage();
    await page.setContent(data, {
      waitUntil: 'domcontentloaded',
    });
    const fileElement = await page.waitForSelector(item);
    const screenshot = await fileElement.screenshot({
      type: 'webp',
      quality: 50,
    });
    await page.close();
    return Buffer.from(screenshot);
  } catch {
    console.error(`截图失败:`, error.message, data, pre);
  } finally {
    if (page && !page.isClosed()) {
      await page
        .close()
        .catch((e) => console.error('页面关闭失败:', e.message));
    }
  }
}

export async function genMsgImage(data) {
  return await genImage(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport"content="width=device-width, initial-scale=1.0"/><style>html,body{font-size:0.875em;background-color:black;font-family:'Microsoft YaHei UI';color:#008000;font-size:1.4rem;margin:0;padding:0}NOR{color:#008000}BLK{color:#505050}BLU{color:#000080}CYN{color:#008080}RED{color:#800000}MAG{color:#800080}YEL{color:#808000}WHT{color:#c0c0c0}ORA{color:#d26900}HIK{color:#808080}HIB{color:#0000ff}HIG{color:#00ff00}HIC{color:#00ffff}HIR{color:#ff0000}HIM{color:#ff00ff}HIY{color:#ffff00}HIW{color:#ffffff}HIO{color:#ffa500}HIJ{color:#ffd700}HIZ{color:#912cee}ORD{color:#ff4500}line{color:#008080;height:30px;line-height:30px;width:100%;display:inline-block;position:relative;text-align:center}line::before{content:'';border-top:1px solid#008080;width:45%;height:2px;position:absolute;top:50%;left:0px}line::after{content:'';border-top:1px solid#008080;width:45%;height:2px;position:absolute;top:50%;right:0px}pre{font-size:inherit;font-family:inherit;margin:0;padding:0.5em;white-space:pre-line;display:inline-block}</style></head><body><pre>${data}</pre></body></html>`,
    'pre'
  );
}
