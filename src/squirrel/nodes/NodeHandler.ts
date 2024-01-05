/* eslint-disable @typescript-eslint/no-unused-vars */
//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Node} from 'estree';
import {NodePath} from 'estree-toolkit';

import {Module} from '../module';

export type TraverseState = {
    module: Module;
}

export abstract class NodeHandler<T extends Node> {

    /**
     * This method is used to preprocess the node and make all the necessary changes
     * to it before it will actually be translated.
     * @param path
     * @param state
     */
    public handlePrepare(path: NodePath<T>, state: TraverseState) {
        // No implementation by default.
    }

    /**
     * This is the code generator. It produces executable Squirrel code
     * from the JavaScript syntax node.
     * @param node
     */
    public handleGenerate(node: T): Generator<string, void, unknown> {
        throw Error(`Node ${node.type} does not implement a Squirrel generator.`);
    }
}