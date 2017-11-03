var ForkTask = require('relieve').tasks.ForkTask
var fork = require('child_process').fork

if(process.execArgv.indexOf('--debug')   !== -1)   {  
  console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);  
  process.execArgv.push('--debug='   + (global.debugPort++)); 
}
if( process.execArgv.indexOf('--inspect') !== -1) { 
  console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);  
  process.execArgv.push('--inspect=' + (global.debugPort++)); 
}

module.exports = function(config, done) {
  child = new ForkTask(fork(__dirname + '/child'));

  child.send('start', config);

  child.once('ranges', ranges => {
    return done(false, ranges);
  });
  child.on('exit', code => {
    if(code !== 0)
      done('ERROR, unable to scan dateranges, please check the console.');
  });
  child.on('message', function(m) {
    if(m === 'ranges Finished') { //AK
      child.send('Exit-Child');  //AK
    }  //AK
  });
}