//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Program} from 'esprima';
import {Declaration, Identifier, MemberExpression} from 'estree';

import {checkBlocked} from './blacklist';
import {ESTreeNode, ESTreeNodeMap} from './nodes';
import {renameNode} from './rename';
import {NodeContext} from './util';

export const ExtraDeclarations = new Map<string, Declaration>();

export const preprocess = (program: Program): void => {
    const ctxParent = {node: program, program};
    preprocessRecursively(ctxParent);

    for (const pair of ExtraDeclarations) {
        const decl = preprocessNodeWithContext(pair[1], ctxParent);
        program.body.unshift(decl as Declaration);
    }
};

type PreprocessingMap = { [K in keyof ESTreeNodeMap]?: (ctx: NodeContext<ESTreeNodeMap[K]>) => void };
const PreprocessorMap: PreprocessingMap = {
    Identifier: (ctx: NodeContext<Identifier>) => {
        checkBlocked(ctx);
        renameNode(ctx);
    },
    MemberExpression: (ctx: NodeContext<MemberExpression>) => {
        checkBlocked(ctx);
        renameNode(ctx);
    }
};

const preprocessRecursively = (ctx: NodeContext) => {
    preprocessContext(ctx);

    const node = ctx.node;
    for (const k in node) {
        const v = node[k];
        if (!v) continue;

        if (typeof v === 'object') {
            if ('type' in v) {
                node[k] = preprocessNodeWithContext(v, ctx);
                continue;
            }

            if (Array.isArray(v)) {
                for (const i in v) {
                    const v2 = v[i];
                    if (!v2) continue;
                    node[k][i] = preprocessNodeWithContext(v2, ctx);
                }
            }
        }
    }
};

const preprocessNodeWithContext = (node: ESTreeNode, parent?: NodeContext) => {
    const ctx: NodeContext = {
        node,
        parent,
        program: parent?.program
    };

    preprocessRecursively(ctx);
    return ctx.node;
};

const preprocessContext = (ctx: NodeContext) => {
    const type = ctx.node.type;
    const fn = PreprocessorMap[type] || null;
    if (!fn) return;

    fn.call(PreprocessorMap, ctx);
};