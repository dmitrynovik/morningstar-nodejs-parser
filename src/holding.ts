export default class Holding {
    ticker: string;
    name: string;
    weight: number;
    shares: number;
    sector: string;
    style: string;
    firstBought: Date;
    country: string;
    YTD: number;

    isNotEmpty():boolean {
        return this.weight != null && this.shares != 0;
    }
}