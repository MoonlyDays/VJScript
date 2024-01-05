//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import path from 'path';

import {Module} from './module';

export function resolveImportedModule(relPath: string, module: Module) {
    const importPath = path.resolve(module.formattedPath.dir, relPath);
    const importFormatPath = path.parse(importPath);
    const importAbsPath = path.format({...importFormatPath, base: '', ext: module.formattedPath.ext});

    return module.translator.addModule(importAbsPath);
}

