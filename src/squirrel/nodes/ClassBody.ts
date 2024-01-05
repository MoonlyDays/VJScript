//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ClassBody} from 'estree';
import {NodePath} from 'estree-toolkit';

import {ensureConstructorInClass, getClassConstructor} from '../helpers/class';
import {generateBody, generateWithScope} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ClassBody> {

    handlePrepare(path: NodePath<ClassBody>) {

        // We generally assume that each class definition must have a constructor.
        ensureConstructorInClass(path);

        const ctor = getClassConstructor(path);
        if (!ctor) {
            throw Error('Class Body doesn\'t have a constructor even though we ensured it?');
        }
    }

    handleGenerate(node: ClassBody): Generator<string, void, unknown> {
        return generateWithScope(() => generateBody(node));
    }
}
