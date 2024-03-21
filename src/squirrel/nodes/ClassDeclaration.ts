//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ClassDeclaration} from 'estree';

import {generateCode} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ClassDeclaration> {

    * handleCodeGen(node: ClassDeclaration): Generator<string, void, unknown> {

        yield 'class ';
        yield generateCode(node.id);

        if (node.superClass) {
            yield ' extends ';
            yield generateCode(node.superClass);
        }

        yield ' ';
        yield generateCode(node.body);
    }

}
