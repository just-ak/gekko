// This config is used in both the
// frontend as well as the web server.

// see https://github.com/askmike/gekko/blob/stable/docs/installing_gekko_on_a_server.md

var  cfg = {
  headless: false,
  api: {
    host: '127.0.0.1',
    port: 3000,
    timeout: 120000 // 2 minutes
  },
  ui: {
    ssl: false,
    host: 'localhost',
    port: 3000,
    path: '/'
  },
  adapter: 'sqlite'
}

// Allows Movement of UI Config to local environment to allow customisation.
// without worrying about git pull overwriting your settings.
//           
// TODO : Merge & Writeback, to include new settings when introduced.
//
var path = require('path');
var fs = require('fs');
var scriptName = path.basename(__filename);
var dir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']  + '/.gekko';
var filename = dir + '/'+scriptName+'.json';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

if (fs.existsSync(filename)) { 
  cfg  = JSON.parse(fs.readFileSync(filename, 'utf8'));
} else {
  fs.writeFile(filename, JSON.stringify(cfg, null, 2) , 'utf-8');
}
console.log(JSON.stringify(cfg,null,4));

const CONFIG = cfg;

if(typeof window === 'undefined')
  module.exports = CONFIG;
else
  window.CONFIG = CONFIG;
