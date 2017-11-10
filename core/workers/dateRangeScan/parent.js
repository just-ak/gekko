var ForkTask = require('relieve').tasks.ForkTask;
var fork = require('child_process').fork;


module.exports = function (config, done) {
  if (process.execArgv.indexOf('--debug') !== -1) {
    console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);
    process.execArgv.push('--debug=' + (global.debugPort++));
  }
  if (process.execArgv.indexOf('--inspect') !== -1) {
    console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);
    process.execArgv.push('--inspect=' + (global.debugPort++));
  }
  
  const child = new ForkTask(fork(__dirname + '/child'));

  try {
    child.send('start', config);

    child.once('ranges', ranges => {
      return done(false, ranges);
    });

    child.on('exit', code => {
      if (code !== 0) {
        done('ERROR, unable to scan dateranges, please check the console.');
      } else {
        console.log('dateRangeScan Child Exited');
      }
    });

    child.on('message', function (m) {
      if (m === 'ranges Finished') { //AK
        child.send('Exit-Child'); //AK
      } //AK
      if(typeof m.log !== 'undefined') {
        console.log('dateRangeScan : ' + m.log);
      }
    });

    child.on('error', function (err) {
      console.log('CHILD dateRangeScan Error  : ' + err);
      console.log('CHILD dateRangeScan  Error Stack :' + err.stack);
    });

    child.on('uncaughtException', function (err) {
      console.log('CHILD dateRangeScan  uncaughtException:' + err);
    });

  } catch (err) {
    console.log('CHILD dateRangeScan  Error Try/Catch:' + err);
    console.log('CHILD dateRangeScan  Error Stack :' + err.stack);

  }
};