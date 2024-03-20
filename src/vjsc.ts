#!/usr/bin/env node

//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as fs from 'fs';
import {
    DEFAULT_WATCH_INTERVAL_MS,
    OptionsMap,
    OptionsShortMap, processFile,
    processOption,
    processShortOption,
    validateOptions
} from "./consts";

const g_kOptions: OptionsMap = {
    watchInterval: DEFAULT_WATCH_INTERVAL_MS
};

const g_kShortOptions: OptionsShortMap = {
    w: 'watch',
    f: 'file',
    d: 'dir',
    t: 'tree',
    i: 'watchInterval'
}

const paths = [];
const argv = process.argv;
for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg.startsWith('-')) {
        let value = argv[++i];
        if (value && value.startsWith('-')) {
            value = undefined;
            i--;
        }

        if (arg.startsWith('--')) {
            processOption(arg.slice(1), value, g_kOptions);
        } else {
            processShortOption(arg.slice(1), value, g_kOptions, g_kShortOptions);
        }

        continue;
    }

    paths.push(arg);
}

validateOptions(g_kOptions);

for (const path of paths) {
    console.log(`Translating ${path}...`);
    processFile(path, g_kOptions);

    if (g_kOptions.watch) {
        fs.watchFile(path, {
            persistent: true, interval: g_kOptions.watchInterval
        }, () => {
            console.log(`[Watch Mode]: ${path} has updated. Translating...`);
            processFile(path, g_kOptions);
        });
    }
}

if (g_kOptions.watch) {
    console.log(`[Watch Mode]: Watch Mode enabled! (interval: ${g_kOptions.watchInterval}ms)`);
}