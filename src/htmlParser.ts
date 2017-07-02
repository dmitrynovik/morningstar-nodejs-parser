const request = require("tinyreq");
const cheerio = require("cheerio");

export class HtmlParser {
    constructor(private url: string, private rootSelector: string, private itemSelector: string) {        
    }
}