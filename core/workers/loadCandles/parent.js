// example usage:

// let config = {
//   watch: {
//     exchange: 'poloniex',
//     currency: 'USDT',
//     asset: 'BTC'
//   },
//   daterange: {
//     from: '2016-05-22 11:22',
//     to: '2016-06-03 19:56'
//   },
//   adapter: 'sqlite',
//   sqlite: {
//     path: 'plugins/sqlite',

//     dataDirectory: 'history',
//     version: 0.1,

//     dependencies: [{
//       module: 'sqlite3',
//       version: '3.1.4'
//     }]
//   },
//   candleSize: 100
// }

// module.exports(config, function(err, data) {
//   console.log('FINAL CALLBACK');
//   console.log('err', err);
//   console.log('data', data.length);
// })


const fork = require('child_process').fork;
const _ = require('lodash');

module.exports = (config, callback) => {

  if (process.execArgv.indexOf('--debug') !== -1) {
    console.log(`core/workers/loadCandes/Parent.js   About to Fork ${global.debugPort}`);
    process.execArgv.push('--debug=' + (global.debugPort++));
  }
  if (process.execArgv.indexOf('--inspect') !== -1) {
    console.log(`core/workers/loadCandes/Parent.js   About to Fork ${global.debugPort}`);
    process.execArgv.push('--inspect=' + (global.debugPort++));
  }
  try {
    const child = fork(__dirname + '/child');

    const message = {
      what: 'start',
      config
    };

    const done = _.once(callback);

    child.on('message', function (m) {
      if (m === 'ready') {
        return child.send(message);
      } else if(typeof m.log !== 'undefined') {
        console.log('loadCandles : ' + m.log);
      } else {
      // else we are done and have candles!
      done(null, m);
      child.send('Exit-Child');
      //AK child.kill('SIGINT');
      }
    });

    child.on('exit', code => {
      if (code !== 0) {
        done('ERROR, unable to load candles, please check the console.');
      } else {
        console.log('loadCandles Child Exited');        
      }
    });
    child.on('error', function (err) {
      console.log(`CHILD loadCandles Error  : ${err}`);
      console.log(`CHILD loadCandles Error Stack : ${err.stack}`);
    });

    child.on('uncaughtException', function (err) {
      console.log(`CHILD  loadCandles  uncaughtException: ${err}`);
    });

  } catch (err) {
    console.log(`CHILD loadCandles  Error Try/Catch: ${err}`);
    console.log(`CHILD loadCandles Error Stack : ${err.stack}`);
  }

};
