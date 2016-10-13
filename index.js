"use strict";

var args		= require('./arguments.js');

var express 	= require('express');
var app 		= express();
var router 		= require('./dynamic')( express, app, args );

router();
