// simple POST request that returns the backtest result

const _ = require('lodash');
const promisify = require('tiny-promisify');
const pipelineRunner = promisify(require('../../core/workers/pipeline/parent'));
const UIconfig = require('../vue/UIconfig');

// Returns UIconfig Server / Port Details for WebClient.

module.exports = function *() {
  var mode = 'UIConfig2';

  result = "const CONFIG =" + JSON.stringify(UIconfig, null, 4) +";";
  result += "window.CONFIG = CONFIG;";

  this.body = result;
}