// mocha.d.ts 
// 
// Mocha (c) 2011-2012 TJ Holowaychuk <tj@vision-media.ca>
// 
// Hand written by Murat Girgin
//  based on http://visionmedia.github.com/mocha/ 
//
 
declare var describe: {
  (testDescription: string, f: Function): any;
  only(testDescription: string, f: Function): any;
  skip(testDescription: string, f: Function): any;    
};

declare var context: {
  (testDescription: string, f?: Function): any;  
}

declare var it: {
  (testDescription: string, f?: Function, done?: Function): any;
  only(testDescription: string, f?: Function, done?: Function): any;
  skip(testDescription: string, f?: Function, done?: Function): any;
};
 
declare function before(f: Function, done?: Function): any;
 
declare function after(f: Function, done?: Function): any;
 
declare function beforeEach(f: Function, done?: Function): any;
 
declare function afterEach(f: Function, done?: Function): any;
