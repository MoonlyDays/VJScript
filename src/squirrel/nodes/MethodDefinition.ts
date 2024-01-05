//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {MethodDefinition} from 'estree';

import {generate} from '../handler';
import {generateArguments, generateBody, generateWithScope} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<MethodDefinition> {

    * handleGenerate(node: MethodDefinition): Generator<string, void, unknown> {
        if (['get', 'set'].includes(node.kind)) {
            throw Error('MethodDefinition: Class getter and setter are not supported yet.');
        }

        if (node.static) {
            yield 'static ';
        }

        if (node.kind == 'method') {
            yield 'function ';
            yield generate(node.key);
        } else {
            yield 'constructor';
        }

        yield '(';
        yield* generateArguments(node.value.params);
        yield ') ';

        yield* generateWithScope(() => generateBody(node.value.body));
    }
}