const fs = require('fs');
import ParallelScrapper from './parallelScrapper';
import MornigstarParser from './morningstarParser';

var output = fs.createWriteStream('out.log');
process.stdout.write = process.stderr.write = output.write.bind(output);

const scrappy = new ParallelScrapper('data/etf_list.csv', (ticker:string) => {
    var parser = new MornigstarParser();
    parser.scrap(ticker);
});
scrappy.start();
