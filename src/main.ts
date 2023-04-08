// For more information, see https://crawlee.dev/
import { PlaywrightCrawler,  Dataset  } from 'crawlee';
import { storeData } from './storeDB.js';

const startUrls = ['https://www.etuovi.com/myytavat-asunnot/helsinki/lauttasaari/taloyhtiot/0120209-3/asunto-oy-melkonkatu-3-bostads-ab'];

const APARTMENT_LABEL = 'APARTMENT'

const crawler = new PlaywrightCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    async requestHandler({ page, parseWithCheerio,log, request,enqueueLinks }) {
        log.info(request.url);


        if (request.label === APARTMENT_LABEL) {
            await page.waitForSelector('.react-swipeable-view-container');
            const $ = await parseWithCheerio();
            const title = await page.title();

            const url = request.url
            const id = url.split('/').pop() || ''

            console.log(`The title of the apartmetn "${request.url}" is: ${title}.`)

            const images: string[] = []


            $('.react-swipeable-view-container img').each((_i, el) => {
               images.push(el.attribs.src)
            })

            console.log($('#infos h3').first().text())
            
            const dataCollected = {
                etuovi_id: id,
                title: title,
                url: request.url,
                images: images,
                price: $('#infos h3').first().text()
            }

            Dataset.pushData(dataCollected);


            storeData({
                ...dataCollected,
                screen_shot: await page.screenshot({fullPage: true})
            });            
        }
        else {
            await enqueueLinks({
                globs: ['https://www.etuovi.com/kohde/*'],
                label: APARTMENT_LABEL
            })  
        }

    }
});

await crawler.run(startUrls);
