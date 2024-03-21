//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {FunctionDeclaration} from 'estree';

import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<FunctionDeclaration> {

    handleCodeGen(node: FunctionDeclaration): Generator<string, void, unknown> {
        return GeneratorHelpers.function(node);
    }
}