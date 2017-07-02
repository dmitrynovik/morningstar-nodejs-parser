const LineByLineReader = require('line-by-line');

import MornigstarParser from './morningstarParser';

export default class CsvInputReader {

    firstLine = true;
    timeout = 100;

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
                // pause emitting of lines...
	            lr.pause();

                setTimeout(function() {
                    var tokens = line.split(",");
                    var ticker = tokens[tokens.length - 1];
                    var parser = new MornigstarParser();
                    parser.scrap(ticker);

                    lr.resume();
                    
                }, self.timeout);
            }
        });

        lr.on('end', function () {
            console.log("reading " + self.path + " is over.");
        });
    }
}