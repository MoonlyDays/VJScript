//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {traverse} from 'estree-toolkit';
import {ESTree} from 'meriyah';

export function preprocess(program: ESTree.Program) {
    traverse(program, TraverseVisitors);
}


type TraverseVisitors = Parameters<typeof traverse>[1];
const TraverseVisitors: TraverseVisitors = {
    Program: x => {

    }
};