//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {TemplateElement} from 'estree';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<TemplateElement> {

    * handleGenerate(node: TemplateElement): Generator<string, void, unknown> {
        yield JSON.stringify(node.value.cooked);
    }
}