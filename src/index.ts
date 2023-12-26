//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {parseModule} from 'meriyah';

import {generate} from './squirrel/generate';
import {MeriyahParseOptions} from './squirrel/helpers';
import {preprocess} from './squirrel/preprocess';

export function translate(jsCode: string): string {
    jsCode = removeShebangs(jsCode);
    const program = parseModule(jsCode, MeriyahParseOptions);
    preprocess(program);
    return generate(program);
}

const removeShebangs = (jsCode: string): string => {
    return jsCode.replace(/^#!.*$/, '');
};

