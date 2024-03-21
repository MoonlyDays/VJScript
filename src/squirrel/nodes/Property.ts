//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Property} from 'estree';
import {NodePath} from 'estree-toolkit';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<Property> {

    handlePrepare(path: NodePath<Property>) {

        const node = path.node;
        if (['get', 'set'].includes(node.kind)) {
            throw Error('Property: Getters and Setters are not supported yet!');
        }
    }

    * handleCodeGen(node: Property): Generator<string, void, unknown> {
        yield codeGen(node.key);
        yield ' = ';
        yield codeGen(node.value);
    }
}