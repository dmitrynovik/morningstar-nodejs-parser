import Holding from './holding';

export default class Fund {
    ticker: string;
    holdings: Holding[];

    constructor(t: string) {
        this.ticker = t;
        this.holdings = [];
    }
}