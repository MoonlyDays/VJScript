#!/usr/bin/env node

import * as fs from "fs";
import * as esprima from "esprima";
import * as path from "path";
import {toSquirrel} from "./squirrel";

// Make sure the file we want to translate actually exists.
const scriptPath = process.argv[2];
if (!fs.existsSync(scriptPath)) {
    console.error("Script not found: " + JSON.stringify(scriptPath));
    process.exit(1);
}

// Ok, it does exist. Get its content and let's work on transpiling it.
const content = fs.readFileSync(scriptPath, 'utf8');

// Create a tree representation of the given program.
const program = esprima.parseModule(content);
// const treePath = path.format({...path.parse(scriptPath), base: '', ext: '.lst'});
// fs.writeFileSync(treePath, JSON.stringify(program, null, 2));

// Generate Squirrel code for the following program tree.
const squirrelCode = toSquirrel(scriptPath, program);
console.log(squirrelCode);

// Save it in the file.
const nutPath = path.format({...path.parse(scriptPath), base: '', ext: '.nut'});
fs.writeFileSync(nutPath, squirrelCode);