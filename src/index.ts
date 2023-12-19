#!/usr/bin/env node

import {Lexer} from "./lexer/Lexer";
import * as fs from "fs";

// Make sure the file we want to transpile actually exists.
const scriptPath = process.argv[2];
if(!fs.existsSync(scriptPath))
{
    console.error("Script not found: " + scriptPath);
    process.exit(1);
}

// Ok, it does exist. Get its content and let's work on transpiling it.
const content = fs.readFileSync(scriptPath, 'utf8');
const lexer = new Lexer(content);
lexer.generate();

