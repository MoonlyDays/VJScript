//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {parseModule} from 'meriyah';

import {generate} from './squirrel/generate';
import {preprocess} from './squirrel/preprocess';

export function translate(jsCode: string): string {
    const program = parseModule(jsCode);
    preprocess(program);
    return generate(program);
}
