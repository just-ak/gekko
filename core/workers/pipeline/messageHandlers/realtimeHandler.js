// pass back all messages as is
// (except for errors and logs)

module.exports = cb => {

  return {
    message: message => {

      if(message.type === 'error') {
        cb(message.error);
        console.error(message.error);
        console.log((message.error);
      }

      else
        cb(null, message);

    },
    exit: status => {
      if(status !== 0) {
        console.log('realtimeHandler - Child Process Died'); //
        cb('Child process has died.');
      }
      else
        cb(null, { done: true });
    }
  }
}