// pass back all messages as is
// (except for errors and logs)

module.exports = cb => {

  return {
    message: message => {

      if (message.type === 'error') {
        var err = new Error();
        console.log('realtimeHandler : ' + message.error); //
        console.log(err.stack); //AK
        cb(message.error);
      } else if (typeof message.log !== 'undefined') {
        console.log('realtimeHandler : ' + message.log);
      } else if (message == "Child-Completed-Work") {
        // Currently Realtime Not Asked to Stop, 
        // Code added as skeleton for future.
        cb(null, {
          done: true
        });
        console.log('realtimeHandler : Complete ');
      } else {
        cb(null, message);
      }
    }
  };
};
