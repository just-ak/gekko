// simple POST request that returns the backtest result

const _ = require('lodash');
const promisify = require('tiny-promisify');
const pipelineRunner = promisify(require('../../core/workers/pipeline/parent'));

const broadcast = cache.get('broadcast'); //AK

// starts a backtest
// requires a post body like:
//
// {
//   gekkoConfig: {watch: {exchange: "poloniex", currency: "USDT", asset: "BTC"},…},…}
//   data: {
//     candleProps: ["close", "start"],
//     indicatorResults: true,
//     report: true,
//     roundtrips: true
//   }
// }
module.exports = function *() {
  var mode = 'backtest';

  var config = {};

  var base = require('./baseConfig');

  let backtestId = (Math.random() + '').slice(3);
  let errored = false;

  var req = this.request.body;

  _.merge(config, base, req.gekkoConfig);

  var result = yield pipelineRunner(mode, config, (err, event) => {
    if(errored)
      return;

    if(err) {
      errored = true;
      console.error('RECEIVED ERROR IN BACKTEST', backtestId);
      console.error(err);
      return broadcast({
        type: 'backtest_error',
        backtest_id: backtestId,
        error: err
      });
    }

    if(!event)
      return;

    // update local cache
    backtestManager.update(importId, {
      latest: event.latest,
      done: event.done
    });

    // emit update over ws
    let wsEvent = {
      type: 'backtest_update',
      import_id: backtestId,
      updates: {
        latest: event.latest,
        done: event.done
      }
    }
    broadcast(wsEvent);
  });

  if(!req.data.report)
    delete result.report;

  if(!req.data.roundtrips)
    delete result.roundtrips;

  if(!req.data.trades)
    delete result.trades;

  // todo: indicatorResults

  result.candles = _.map(
    result.candles,
    c => _.pick(c, req.data.candleProps)
  );

  let daterange = this.request.body.importer.daterange;
  
    const _backtest = {
      watch: config.watch,
      id: backtestID,
      latest: '',
      from: daterange.from,
      to: daterange.to
    }

  backtestManager.add(_backtest);
  this.body = result;
}