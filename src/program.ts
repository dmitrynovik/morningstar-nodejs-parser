const fs = require('fs');

import ParallelScrapper from './parallelScrapper';
import MornigstarParser from './morningstarParser';
import Persister from './persister';

var output = fs.createWriteStream('out.log');
process.stdout.write = process.stderr.write = output.write.bind(output);

const persister = new Persister("out/db.sqlite");

const scrappy = new ParallelScrapper('data/etf_list.csv', (ticker:string) => {
    var parser = new MornigstarParser(persister);
    parser.scrap(ticker);
});
scrappy.start();
