const LineByLineReader = require('line-by-line');
const parallelBatch = require("parallel-batch");

import MornigstarParser from './morningstarParser';

export default class ParallelScrapper {

    firstLine = true;
    complete = false;    
    parallelism = 10; // how many jobs do we want to run in parallel:
    tickers:string[] = [];

    constructor(private path:string) {
    }

    start() {
        const lr = new LineByLineReader(this.path);
        const self = this;

        lr.on('error', function (err:any) {
            console.log(err);
        });

        lr.on('line', function (line:string) {
            if (self.firstLine) {
                self.firstLine = false;
            }
            else
            {
                var tokens = line.split(",");
                var ticker = tokens[tokens.length - 1];
                self.tickers.push(ticker);
            }
        });

        lr.on('end', function () {
            console.log("found tickers:", self.tickers.length);

            // scrap all in parallel:
            parallelBatch(self.tickers,
                self.parallelism,
                (tickers:Array<string>) => {
                    tickers.forEach( ticker => {
                        try {
                            var parser = new MornigstarParser();
                            parser.scrap(ticker);
                        } catch (err) {
                            console.error(err);
                        }
                    })
                },
                (error:any, results:Array<any>) => {
                    if (error)
                        console.error(error);
                    
                    self.complete = true;
                    console.log("all done.");
                });
            });
    } 
}