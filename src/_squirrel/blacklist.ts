//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {IdentifierBlackList} from '../squirrel/config';
import {
    collapseIdentifier, encodeIdentifier,
    findListEntryByNode,
    IdentifierNode,
    NodeContext
} from './util';

export function checkBlocked(ctx: NodeContext<IdentifierNode>) {
    const rule = findListEntryByNode(IdentifierBlackList, ctx);
    if (!rule) {
        return;
    }

    const nodeIdent = collapseIdentifier(ctx.node);
    if (nodeIdent === false)
        return;

    throw Error(`Identifier ${encodeIdentifier(nodeIdent)} is blacklisted.`);
}