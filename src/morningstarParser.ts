const request = require('tinyreq');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

import Holding from './holding';
import Fund from './fund';

export default class MorningstarParser {

    scrap(ticker: string) {

        const getMorningstarTicker = () => {
            const parts = ticker.split(":");

            switch(parts[0].toUpperCase()) {
                case "ASX": return "XASX:" + parts[1];
                case "LSE": return "XLSE:" + parts[1];
                case "ARCA": return "ARCX:" + parts[1];
                default: return ticker;
            }
        };

        const url = "http://portfolios.morningstar.com/fund/ajax/holdings_tab?&t=" + getMorningstarTicker();
        console.log("processing", url);
        const fund = new Fund(ticker);

        request(url, (err:any, body:string) => {
            if (err) {
                console.error(err);
                return;
            }

            try
            {
            const html = JSON.parse(body).htmlStr;
            const dom = new JSDOM(html);
            const $ = require('jquery')(dom.window);

            const getCellText = (cells:Array<any>, i:number) => $(cells[i]).html();
            const getCellInt = (cells:Array<any>, i:number) => parseInt(getCellText(cells, i).replace(/,/g, ""));

            const getCellDate = (cells:Array<any>, i:number) => { 
                const tokens = getCellText(cells, i).split("/");
                return new Date(parseInt(tokens[2]), parseInt(tokens[0]), parseInt(tokens[1]));
            }

            const getSector = (cells:Array<any>) => { 
                const code = $(cells[6]).find("span").attr("class").replace("sctr_", "").toLowerCase();
                switch (code) {
                    case "bm": return {name: "Basic Materials", style: "Cyclical"};
                    case "cc": return {name: "Consumer Cyclical", style: "Cyclical"};
                    case "fs": return {name: "Financial Services", style: "Cyclical"};
                    case "re": return {name: "Real Estate", style: "Cyclical"};
                    case "cd": return {name: "Consumer Defensive", style: "Defensive"};
                    case "h": return {name: "Healthcare", style: "Defensive"};
                    case "u": return {name: "Utilities", style: "Defensive"};
                    case "cs": return {name: "Communication Services", style: "Sensitive"};
                    case "e": return {name: "Energy", style: "Sensitive"};
                    case "i": return {name: "Industrials", style: "Sensitive"};
                    case "t": return {name: "Technology", style: "Sensitive"};
                    default: return {name: code, style: ""};
                }
            }

            const items = $("#holding_epage0 tr");
            items.each((i:number, element:any) => {
                const $element = $(element);

                const companyRef = $element.find("th a").attr("href");
                if (companyRef) {
                    const ixStart = companyRef.indexOf("?t=");
                    const ixEnd = companyRef.indexOf("&", ixStart + 1);

                    if (ixEnd >=0 && ixStart >= 0) {
                        const companyTicker = companyRef.substr(ixStart + 3, ixEnd - ixStart - 3);
                        try
                        {
                            const $cells = $element.find("td");

                            const holding = new Holding();
                            holding.ticker = companyTicker;
                            holding.weight = parseFloat(getCellText($cells, 3));
                            holding.shares = getCellInt($cells, 4);
                            const sector = getSector($cells);
                            holding.sector = sector.name;
                            holding.style = sector.style;
                            holding.firstBought = getCellDate($cells, 9);
                            holding.country = getCellText($cells, 11);
                            holding.YTD = getCellText($cells, 12);
                            
                            console.log(holding);
                            fund.holdings.push(holding);
                        }
                        catch (parseErr) {
                            console.error(parseErr);
                        }
                    }
                }
            });
            }
            catch(error) {
                console.error(error);
            }
        });
    }    
}