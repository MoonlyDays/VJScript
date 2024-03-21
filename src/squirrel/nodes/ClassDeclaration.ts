//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ClassDeclaration} from 'estree';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ClassDeclaration> {

    * handleCodeGen(node: ClassDeclaration): Generator<string, void, unknown> {

        yield 'class ';
        yield codeGen(node.id);

        if (node.superClass) {
            yield ' extends ';
            yield codeGen(node.superClass);
        }

        yield ' ';
        yield codeGen(node.body);
    }

}
