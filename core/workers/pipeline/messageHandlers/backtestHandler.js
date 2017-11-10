// listen to all messages and internally queue
// all candles and tades, when done report them
// all back at once

module.exports = done => {
  var trades = [];
  var roundtrips = [];
  var candles = [];
  var report = false;
  
  return {
    message: message => {

      if(message.type === 'candle')
        candles.push(message.candle);

      else if(message.type === 'trade')
        trades.push(message.trade);

      else if(message.type === 'roundtrip')
        roundtrips.push(message.roundtrip);

      else if(message.type === 'report')
        report = message.report;

      else if(typeof message.log !== 'undefined') {
        console.log('backtestHandler : ' +message.log);
      }
      else if (message === 'Child-Completed-Work') {
        done(null, {
          trades: trades,
          candles: candles,
          report: report,
          roundtrips: roundtrips
        });
        console.log('backtestHandler : Complete ');
      }
    }
  };
};