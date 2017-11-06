var util = require(__dirname + '/../../util');

var dirs = util.dirs();
var ipc = require('relieve').IPCEE(process);
try {
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
ipc.on('error',function(err) {
  console.log('IPC Error  : '+err );
  console.log('CHILD Error Stack :'+err.stack );});

ipc.on('uncaughtException',function(err) {
  console.log('IPC uncaughtException:'+err);});



} catch (err) {
console.log('IPC Error Try/Catch:'+err);
console.log('IPC Error Stack :'+err.stack );

}
