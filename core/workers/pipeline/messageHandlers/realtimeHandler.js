// pass back all messages as is
// (except for errors and logs)

module.exports = cb => {

  return {
    message: message => {

      if(message.type === 'error') {
        var err = new Error();
        console.log('realtimeHandler : ' + message.error); //
        console.log(err.stack); //AK
        cb(message.error);
      }
      if(typeof message.log !== 'undefined') {
        console.log('realtimeHandler : ' + message.log);
      } else
        cb(null, message);

    },
    exit: status => {
      if(status !== 0) {
        var err = new Error();
        
        console.log('realtimeHandler - Child Process Died :' );
        console.log(err.stack); //AK
        cb('Child process has died.');
      }
      else
        cb(null, { done: true });
    }
  }
}