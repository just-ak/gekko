var fork = require('child_process').fork;

module.exports = (mode, config, callback) => {

  if (process.execArgv.indexOf('--debug') !== -1) {
    console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);
    process.execArgv.push('--debug=' + (global.debugPort++));
  }
  if (process.execArgv.indexOf('--inspect') !== -1) {
    console.log(`./workers/pipeline/Parent.js   About to Fork ${global.debugPort}`);
    process.execArgv.push('--inspect=' + (global.debugPort++));
  }
  try {

    var child = fork(__dirname + '/child');

    // How we should handle client messages depends
    // on the mode of the Pipeline that is being ran.

    var handle = require('./messageHandlers/' + mode + 'Handler')(callback);

    var message = {
      what: 'start',
      mode: mode,
      config: config
    };
    var totalMessages = 0;
    var workComplete = false;

    child.on('message', function (m) {
      totalMessages++;
      if (m === 'ready') {
        return child.send(message);
      }

      handle.message(m);

      // Because it is possible to exit the child before all messages are processed and
      // and those messages will just be lost.
      // A simple message handshake is used to acknowledge the end of the childs work
      // Once the work is complete, workComplete is set to true, so that any other
      // child exits can be identified as a problem.

      if ((m === 'Child-Completed-Work')) { 
        console.log(`${mode} Finished (Child being told to exit) Total Messages : ${totalMessages}`);
        workComplete=true;  // Checked in on exit to detect exit because of problem.
        child.send('Exit-Child'); 
      } //AK
    });

    child.on('exit', function (m) {
        if (workComplete) {
          console.log(mode + ' Finished (Child Exited)');
        } else {
          var err = new Error();
          console.log(err.stack); //AK
          cd(mode + ' Child Died');
        }});

    child.on('error', function (err) {
      console.log(`CHILD ${mode} Error  : ${err}`);
      console.log(`CHILD ${mode} Error Stack : ${err.stack}`);
    });

    child.on('uncaughtException', function (err) {
      console.log(`CHILD  ${mode}  uncaughtException: ${err}`);
    });

    return child;

  } catch (err) {
    console.log(`CHILD ${mode}  Error Try/Catch: ${err}`);
    console.log(`CHILD ${mode} Error Stack : ${err.stack}`);

  }

  

};
