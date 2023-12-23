#!/usr/bin/env node

//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as esprima from 'esprima';
import * as fs from 'fs';
import * as path from 'path';

import {preprocess} from './squirrel/preprocessing';
import {translate} from './squirrel/translation';

// Make sure the file we want to translate actually exists.
const scriptPath = process.argv[2];
if (!fs.existsSync(scriptPath)) {
    console.error('Script not found: ' + JSON.stringify(scriptPath));
    process.exit(1);
}

// Read the JavaScript file from the file.
const jsCode = fs.readFileSync(scriptPath, 'utf8');
// Build a syntax tree of the program
const program = esprima.parseModule(jsCode);
// Preprocess it to allow better compatibility with Squirrel
preprocess(program);
// Translate it to Squirrel code.
const nutCode = translate(scriptPath, program);
console.log(nutCode);

// Save it in the file.
const nutPath = path.format({...path.parse(scriptPath), base: '', ext: '.nut'});
fs.writeFileSync(nutPath, nutCode);