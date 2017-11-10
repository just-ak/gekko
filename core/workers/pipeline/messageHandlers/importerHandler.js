module.exports = cb => {

  return {
    message: message => {

      if(message.type === 'update')
        cb(null, {
          done: false,
          latest: message.latest
        })

      else if(message.type === 'error') {
        cb(message.error);
        console.error(message.error);
      }
      else if(typeof message.log !== 'undefined') {
        console.log('importHandler : ' +message.log);
      }
    },
    exit: status => {
      if(status !== 0){
        console.log('importerHandler - Child Process Died'); //AK
        return cb('Child process has died.');
      }
      else
        cb(null, { done: true });
    }
  }
}