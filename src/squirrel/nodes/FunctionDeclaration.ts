//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {FunctionDeclaration} from 'estree';

import {generateFunction} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<FunctionDeclaration> {

    handleGenerate(node: FunctionDeclaration): Generator<string, void, unknown> {
        return generateFunction(node);
    }
}