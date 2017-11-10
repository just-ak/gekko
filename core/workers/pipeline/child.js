/*

  Gekko is a Bitcoin trading bot for popular Bitcoin exchanges written 
  in node, it features multiple trading methods using technical analysis.

  If you are interested in how Gekko works, read more about Gekko's 
  architecture here:

  https://github.com/askmike/gekko/blob/stable/docs/internals/architecture.md

  Disclaimer:

  USE AT YOUR OWN RISK!

  The author of this project is NOT responsible for any damage or loss caused 
  by this software. There can be bugs and the bot may not perform as expected 
  or specified. Please consider testing it first with paper trading and/or 
  backtesting on historical data. Also look at the code to see what how 
  it is working.

*/

console.log = function (d) {
  process.send({
    type: 'log',
    log: 'CHILD LOG : ' + d
  });
};
console.warn = function (err) {
  process.send({
    type: 'log',
    log: 'CHILD WARN : ' + err
  });
};
console.error = function (err) {
  process.send({
    type: 'log',
    log: 'CHILD ERROR : ' + err
  });
};


//console.log('TEST-_-----___--___--- Should Have come from child')
var start = (mode, config) => {
  var util = require(__dirname + '/../../util');

  // force correct gekko env
  util.setGekkoEnv('child-process');

  var dirs = util.dirs();

  // force correct gekko mode & config
  util.setGekkoMode(mode);
  util.setConfig(config);

  var pipeline = require(dirs.core + 'pipeline');
  pipeline({
    config: config,
    mode: mode
  });
};

process.send('ready');

//AK Not fired : process.on('error',function(err) {console.log('IN CHILD Error:'+err);});
//AK Not fired : process.on('uncaughtException',function(err) {console.log('IN CHILD uncaughtException:'+err);});

process.on('message', function (m) {
  if (m.what === 'start') {
    start(m.mode, m.config);
  } else if (m === 'Exit-Child') { //AK
    console.log('Received Exit-Child');
    process.exit(); //AK  
  } else {
    console.log('pipeline/child/message' + JSON.stringify(m));
  }
});
