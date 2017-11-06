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

if(process.execArgv.indexOf('--debug')   !== -1)   {  
  console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);  
  process.execArgv.push('--debug='   + (global.debugPort++)); 
}
if( process.execArgv.indexOf('--inspect') !== -1) { 
  console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);  
  process.execArgv.push('--inspect=' + (global.debugPort++)); 
}
const fork = require('child_process').fork;
const _ = require('lodash');

module.exports = (config, callback) => {
  const child = fork(__dirname + '/child');
  try {
  const message = {
    what: 'start',
    config
  }

  const done = _.once(callback);

  child.on('message', function(m) {
    
    if(m === 'ready')
      return child.send(message);

    // else we are done and have candles!
    done(null, m);

    //child.kill('SIGINT');
    child.send('Exit-Child');
   
  });

  child.on('exit', code => {
    if(code !== 0)
      done('ERROR, unable to load candles, please check the console.');
  });
  child.on('exit',function(m){ console.log(`loadCandles Child Exited`);});
  child.on('error',function(err) {
    console.log('CHILD Error  : '+err );
    console.log('CHILD Error Stack :'+err.stack );});

  child.on('uncaughtException',function(err) {
    console.log('CHILD uncaughtException:'+err);});



} catch (err) {
  console.log('CHILD Error Try/Catch:'+err);
  console.log('CHILD Error Stack :'+err.stack );
  
}
}