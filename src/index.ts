#!/usr/bin/env node

import * as fs from "fs";
import * as esprima from "esprima";
import {toSquirrel} from "./squirrel";
import * as path from "path";

// Make sure the file we want to transpile actually exists.
const scriptPath = process.argv[2];
if (!fs.existsSync(scriptPath)) {
    console.error("Script not found: " + JSON.stringify(scriptPath));
    process.exit(1);
}

// Ok, it does exist. Get its content and let's work on transpiling it.
const content = fs.readFileSync(scriptPath, 'utf8');

// Create a tree representation of the given program.
const program = esprima.parseModule(content);
const squirrelCode = toSquirrel(program);

const nutPath = path.format({...path.parse(scriptPath), base: '', ext: '.nut'});
fs.writeFileSync(nutPath, squirrelCode);