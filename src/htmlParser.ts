const request = require("tinyreq");
const cheerio = require("cheerio");
const fs = require('fs');

export default class HtmlParser {

    constructor() {  }

    scrap(url: string,                                           // Url to scrap
          itemSelector: string,                                  // Items to be scrapped within the root
          valuesSelector: (html: string) => Map<string, string>, // Values selector function
          persister: (values: Map<string, string>) => void)      // Persister function
    {
        console.log("processing", url);

        request(url, (err:any, body:string) => {
            if (err) {
                console.error(err);
                return;
            }

            const $ = cheerio.load(body);
            fs.writeFile("./out/scrapped.html", $.html(), function(ioError:any) {
                if(ioError) {
                    return console.log(err);
                }
            });

            console.log("selecting", itemSelector);
            const items = $("#equity_holding_tab");
            console.log("items length:", items.length);
            items.each((item:any) => {
                console.log($(this).html());
            });
        });
    }
}