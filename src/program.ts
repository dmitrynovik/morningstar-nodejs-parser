import csvInputReader from './csvInputReader';

//import MorningstarParser from './morningstarParser';
//const parser = new MorningstarParser();
//parser.scrap("XASX:STW");

const inputReader = new csvInputReader('data/etf_list.csv');
inputReader.start();