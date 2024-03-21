//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {MethodDefinition} from 'estree';

import {generateCode} from '../handler';
import {generateArgumentsCode, generateBodyCode, generateCodeWithScope} from '../helpers/generator';
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
            yield generateCode(node.key);
        } else {
            yield 'constructor';
        }

        yield '(';
        yield* generateArgumentsCode(node.value.params);
        yield ') ';

        yield* generateCodeWithScope(() => generateBodyCode(node.value.body));
    }
}