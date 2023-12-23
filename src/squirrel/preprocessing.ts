//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Program} from 'esprima';
import {BaseNode, Declaration, Identifier, MemberExpression} from 'estree';

import {ESTreeNodeMap} from './nodes';
import {renameNode} from './rename';
import {NodeContext} from './util';

export const ExtraDeclarations = new Map<string, Declaration>();

export const preprocess = (program: Program): void => {
    preprocessRecursively({node: program, program});

    for (const decl of ExtraDeclarations) {
        program.body.unshift(decl[1]);
    }
};

type PreprocessingMap = { [K in keyof ESTreeNodeMap]?: (ctx: NodeContext<ESTreeNodeMap[K]>) => void };
const PreprocessorMap: PreprocessingMap = {
    Identifier: (ctx: NodeContext<Identifier>) => {
        renameNode(ctx);
    },
    MemberExpression: (ctx: NodeContext<MemberExpression>) => {
        renameNode(ctx);
    }
};

const preprocessRecursively = (ctx: NodeContext) => {
    preprocessNode(ctx);

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

const preprocessNodeWithContext = (node: BaseNode, parent: NodeContext) => {
    const ctx: NodeContext = {
        node,
        parent,
        program: parent.program
    };

    preprocessRecursively(ctx);
    return ctx.node;
};

const preprocessNode = (ctx: NodeContext) => {
    const type = ctx.node.type;
    const fn = PreprocessorMap[type] || null;
    if (!fn) return;

    fn.call(PreprocessorMap, ctx);
};