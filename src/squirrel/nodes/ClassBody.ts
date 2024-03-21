//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ClassBody} from 'estree';
import {NodePath} from 'estree-toolkit';

import {ensureConstructorExists} from '../helpers/class';
import {generateBodyCode, generateCodeWithScope} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ClassBody> {

    handlePrepare(path: NodePath<ClassBody>) {

        // We generally assume that each class definition must have a constructor.
        ensureConstructorExists(path);
    }

    handleCodeGen(node: ClassBody): Generator<string, void, unknown> {
        return generateCodeWithScope(() => generateBodyCode(node));
    }
}
