var fork = require('child_process').fork;

module.exports = (mode, config, callback) => {

  if(process.execArgv.indexOf('--debug')   !== -1)   {  
    console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);  
    process.execArgv.push('--debug='   + (global.debugPort++)); 
  }
  if( process.execArgv.indexOf('--inspect') !== -1) { 
    console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);  
    process.execArgv.push('--inspect=' + (global.debugPort++)); 
  }


  var child = fork(__dirname + '/child');

  // How we should handle client messages depends
  // on the mode of the Pipeline that is being ran.
  var handle = require('./messageHandlers/' + mode + 'Handler')(callback);

  var message = {
    what: 'start',
    mode: mode,
    config: config
  }
  var totalMessages = 0;

  child.on('message', function(m) {
    totalMessages++;
    if(m === 'ready')
      return child.send(message);

    handle.message(m);
    
    if ((m === 'Backtest Finished') || ( m === 'Backtest Finished - No Candles')) { //AK
      child.send('Exit-Child'); //AK
    } //AK
  });

  if (mode !='backtest') {
    /*
    Exit Child by using Message Handshake to perform end
    Currently only tested with the GUI Backtest
    */
    child.on('exit', handle.exit);
  } else {
    child.on('exit',function(m){ console.log(`Backtest Finished (Child Exited) Total Messages : ${totalMessages}`);});
  }

  return child;
}