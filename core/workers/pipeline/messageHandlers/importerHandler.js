module.exports = cb => {

  return {
    message: message => {

      if (message.type === 'update') {
        cb(null, {
          done: false,
          latest: message.latest
        });
      } else if (message == "Child-Completed-Work") {
        cb(null, {
          done: true,
          latest: message.latest
        });
        console.log('importerHandler : Complete ');
      } else if (message.type === 'error') {
        cb(message.error);
        console.error(message.error);
      } else if (typeof message.log !== 'undefined') {
        console.log('importerHandler : ' + message.log);
      }
    }
  };
};
