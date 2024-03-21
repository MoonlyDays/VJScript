//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ClassBody} from 'estree';
import {NodePath} from 'estree-toolkit';

import {ClassHelpers} from '../helpers/ClassHelpers';
import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ClassBody> {

    handlePrepare(path: NodePath<ClassBody>) {

        // We generally assume that each class definition must have a constructor.
        ClassHelpers.ensureConstructorExists(path);
    }

    handleCodeGen(node: ClassBody): Generator<string, void, unknown> {
        return GeneratorHelpers.withScope(() => GeneratorHelpers.body(node));
    }
}
