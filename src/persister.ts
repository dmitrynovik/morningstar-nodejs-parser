const sqlite = require('sqlite3').verbose();
const fs = require('fs');

import Holding from './holding';

export default class Persister {

    private db : any;

    constructor(private dbPath: string) {        
        this.db = new sqlite.Database(this.dbPath);

        fs.exists(dbPath, (exists:boolean) => {
            if (exists) {
                this.db.run("DELETE FROM holdings");
            } else {
                this.db.run("CREATE TABLE holdings (fundTicker TEXT, ticker TEXT, name TEXT, weight REAL, shares REAL, sector TEXT, style TEXT, firstBought TEXT, country TEXT, YTD REAL)");
            }
        });
    }

    persist(fundTicker: string, h: Holding) {
            this.db.run("INSERT INTO holdings VALUES (?,?,?,?,?,?,?,?,?,?)", 
                fundTicker,
                h.ticker,
                h.name,
                h.weight,
                h.shares,
                h.sector,
                h.style,
                h.firstBought,
                h.country,
                h.YTD);
    }

}