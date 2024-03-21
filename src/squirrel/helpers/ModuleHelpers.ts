//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import fs from 'fs';
import path from 'path';

import {Module} from '../Module';

export const ModuleHelpers = {

    /**
     * Try to resolve an imported path into an actual Module instance. This is
     * used to figure out the path when we're using require() function.
     * @param importPath
     * @param currentModule
     */
    resolveImportedPath(importPath: string, currentModule: Module): Module {

        // If module path doesn't start with a dot notation, we're most likely
        // trying to include a module inside node_modules directory.
        if (!importPath.startsWith('.')) {
            const pack = this.resolvePackageByName(importPath, currentModule);
            if (pack) {
                return pack;
            }
        }

        // Import path should be resolved relative to the module that is importing.
        importPath = path.resolve(currentModule.parsedPath.dir, importPath);
        const parsedPath = path.parse(importPath);
        importPath = path.format({...parsedPath, base: '', ext: currentModule.parsedPath.ext});
        return currentModule.translator.includeModule(importPath);
    },

    /**
     * Resolve the name of the package module (usually identified by its name)
     * into a Module instance.
     * @param packageName
     * @param currentModule
     */
    resolvePackageByName(packageName: string, currentModule: Module): Module {
        const packageDir = path.resolve(currentModule.translator.packageDir, 'node_modules', packageName);
        const packageJson = path.resolve(packageDir, 'package.json');

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
    },

    /**
     * Determine the root directory for the package of the provided script file path.
     * @param modulePath
     */
    determinePackageRoot(modulePath: string) {
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
}

