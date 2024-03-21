//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Program} from 'estree';

import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";

export default class extends NodeHandler<Program> {
    handleCodeGen(node: Program): Generator<string, void, unknown> {
        return GeneratorHelpers.body(node);
    }
}