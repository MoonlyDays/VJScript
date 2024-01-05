//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import path from 'path';

import {Module} from '../module';

export function resolveImportedModule(importPath: string, currentModule: Module) {

    // Import path should be resolved relative to the module that is importing.
    importPath = path.resolve(currentModule.formattedPath.dir, importPath);

    const parsedPath = path.parse(importPath);
    importPath = path.format({...parsedPath, base: '', ext: currentModule.formattedPath.ext});

    return currentModule.translator.addModule(importPath);
}