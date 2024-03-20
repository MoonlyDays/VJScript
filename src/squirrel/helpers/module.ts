//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import fs from 'fs';
import path from 'path';

import {name as PackageName} from '../../../package.json';
import {Module} from '../module';

export function resolveImportedModule(importPath: string, currentModule: Module) {

    if (!importPath.startsWith('.')) {
        const pack = resolvePackageModule(importPath, currentModule);
        if (pack) {
            return pack;
        }
    }

    // Import path should be resolved relative to the module that is importing.
    importPath = path.resolve(currentModule.parsedPath.dir, importPath);

    const parsedPath = path.parse(importPath);
    importPath = path.format({...parsedPath, base: '', ext: currentModule.parsedPath.ext});

    return currentModule.translator.includeModule(importPath);
}

export function resolvePackageModule(packageName: string, currentModule: Module) {

    const packageDir = path.resolve(currentModule.translator.packageDir, 'node_modules', packageName);
    const packageJson = path.resolve(packageDir, 'package.json');

    console.log(packageJson);
    if (!fs.existsSync(packageJson))
        return;

    // Read that file and get the entry main file.
    const packageRaw = fs.readFileSync(packageJson, {encoding: 'utf-8'});
    const packageInfo = JSON.parse(packageRaw);

    const entryScript = packageInfo.main || './index.js';
    const entryScriptPath = path.resolve(packageDir, entryScript);

    if (!fs.existsSync(entryScriptPath)) {
        throw Error(`resolvePackageModule: Could not resolve entry script path for package "${packageName} (${entryScript})"`);
    }

    return currentModule.translator.includeModule(entryScriptPath);
}

export function isDeclarativeModule(importPath: string) {
    return importPath == PackageName;
}

/**
 * Determine the root directory for the
 * package of the provided script file path.
 * @param modulePath
 */
export function determinePackageRoot(modulePath: string) {
    modulePath = path.resolve(process.cwd(), modulePath);
    modulePath = path.parse(modulePath).dir;
    const dirs = modulePath.split('\\');

    do {
        const curDir = dirs.join('\\');
        const packageDir = curDir + '\\package.json';

        if (fs.existsSync(packageDir))
            return curDir;

        dirs.pop();
    } while (dirs.length > 0);

    throw Error('Could not determine a package root directory.');
}
