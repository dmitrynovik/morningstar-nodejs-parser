const LineByLineReader = require('line-by-line');
const parallelBatch = require("parallel-batch");

import MornigstarParser from './morningstarParser';

export default class ParallelScrapper {

    private skipFirstLine = true;
    private firstLine = true;
    private complete = false;    
    private parallelismDegree = 10; // how many jobs do we want to run in parallel
    private tickers:string[] = [];

    constructor(private path:string, private parseFunction: (ticker:string) => void) {
    }

    start() {
        const lr = new LineByLineReader(this.path);
        const self = this;

        lr.on('error', function (err:any) {
            console.log(err);
        });

        lr.on('line', function (line:string) {
            console.log(line);
            if (self.skipFirstLine && self.firstLine) {
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
                self.parallelismDegree,
                (tickers:Array<string>) => {
                    tickers.forEach( ticker => {
                        try {
                            self.parseFunction(ticker);
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