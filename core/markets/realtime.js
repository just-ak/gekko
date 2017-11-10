var _ = require('lodash');

var util = require('../util');
var dirs = util.dirs();

var exchangeChecker = require(dirs.core + 'exchangeChecker');
var config = util.getConfig();

const slug = config.watch.exchange.toLowerCase();
const exchange = exchangeChecker.getExchangeCapabilities(slug);

if(!exchange) {
  console.log(`/core/markets/realtime/  ${slug} `);
  util.die(`Unsupported exchange: ${slug}`);
}

var error = exchangeChecker.cantMonitor(config.watch);
if(error) {
  console.log(`/core/markets/realtime/  ${slug} `); //AK
  console.log(error.stack);  //AK
  util.die(error, true);
}
module.exports = require(dirs.budfox + 'budfox');