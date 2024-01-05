//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ClassDeclaration} from 'estree';

import {generate} from '../generate';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ClassDeclaration> {

    * handleGenerate(node: ClassDeclaration): Generator<string, void, unknown> {

        yield 'class ';
        yield generate(node.id);

        if (node.superClass) {
            yield ' extends ';
            yield generate(node.superClass);
        }

        yield ' ';
        yield generate(node.body);
    }

}
