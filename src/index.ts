#!/usr/bin/env node

import * as fs from "fs";
import * as esprima from "esprima";
import * as path from "path";
import {toSquirrel} from "./translate";

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
const treePath = path.format({...path.parse(scriptPath), base: '', ext: '.lst'});
fs.writeFileSync(treePath, JSON.stringify(program, null, 2));

const squirrelCode = toSquirrel(scriptPath, program);
console.log(squirrelCode);

const nutPath = path.format({...path.parse(scriptPath), base: '', ext: '.nut'});
fs.writeFileSync(nutPath, squirrelCode);