"use strict";

var extend = require('util-extend');
var config = require('./package.json');
var ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
	version: config.version,
	addHelp: true,
	description: config.description
});

parser.addArgument(
	['--development'],
	{
		action: 'storeConst',
		dest: 'development',
		help: 'Start the server in development mode. This enables live development, live debugging, and TCP/IP listening.',
		constant: true
	}
);

parser.addArgument(
	['--port', '-p'],
	{
		action: 'store',
		dest: 'port',
		help: 'Specify a TCP port for the development server to listen on. The default is 8080. This has no effect when in production mode.',
		defaultValue: 8080
	}
);


module.exports = extend( config, parser.parseArgs() );