const fs = require('fs');
import ParallelScrapper from './parallelScrapper';

var output = fs.createWriteStream('out.log');
process.stdout.write = process.stderr.write = output.write.bind(output);

const scrappy = new ParallelScrapper('data/etf_list.csv');
scrappy.start();
