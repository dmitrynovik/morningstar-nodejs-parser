import HtmlParser from './htmlParser';

export default class MorningstarParser extends HtmlParser {

    scrap(ticker: string) {
        return super.scrap(
            "http://portfolios.morningstar.com/fund/holdings?t=" + ticker, 
            "#equity_holding_tab #holding_epage0 tr", 
            text => {
                const map = new Map<string, string>();
                return map;
            },
            values => {

            });
    }
    
}