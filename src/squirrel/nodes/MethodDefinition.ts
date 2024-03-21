//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {MethodDefinition} from 'estree';

import {codeGen} from '../handler';
import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<MethodDefinition> {

    * handleCodeGen(node: MethodDefinition): Generator<string, void, unknown> {
        if (['get', 'set'].includes(node.kind)) {
            throw Error('MethodDefinition: Class getter and setter are not supported yet.');
        }

        if (node.static) {
            yield 'static ';
        }

        if (node.kind === 'method') {
            yield 'function ';
            yield codeGen(node.key);
        } else {
            yield 'constructor';
        }

        yield '(';
        yield* GeneratorHelpers.arguments(node.value.params);
        yield ') ';

        yield* GeneratorHelpers.withScope(() => GeneratorHelpers.body(node.value.body));
    }
}