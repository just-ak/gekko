var util = require(__dirname + '/../../util');

var dirs = util.dirs();
var ipc = require('relieve').IPCEE(process);

ipc.on('start', config => {

  // force correct gekko env
  util.setGekkoEnv('child-process');

  // force disable debug
  config.debug = false;

  // persist config
  util.setConfig(config);

  var scan = require(dirs.tools + 'dateRangeScanner');
  scan(
    (err, ranges, reader) => {
      reader.close();
      ipc.send('ranges', ranges)
      ipc.send('ranges Finished') //AK
      //process.exit(0);  //AK
    }
  );

});

ipc.on('message', (m) => {  //AK
  if(m.what === 'Exit-Child') //AK
    process.exit(); //AK
});

