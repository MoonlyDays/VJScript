//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import Config from '../config.json';
import {CollapsedIdentifier, decodeIdentifier} from './util';

type RenameRuleShared = { pattern: CollapsedIdentifier; };
type RenameRuleAlias = RenameRuleShared & { rename: CollapsedIdentifier; }
type RenameRuleDeclare = RenameRuleShared & { declaration: string; }
export type RenameRule = RenameRuleAlias | RenameRuleDeclare;

export const IdentifierRenameList: RenameRule[] = [];

function parseAlias(encodedSearch: string, encodedRename: string) {
    const searchIdentifier = decodeIdentifier(encodedSearch);
    const renameIdentifier = decodeIdentifier(encodedRename);

    IdentifierRenameList.push({
        pattern: searchIdentifier,
        rename: renameIdentifier
    });
}

function parseDeclare(encodedSearch: string, declareCode: string) {
    const searchIdentifier = decodeIdentifier(encodedSearch);

    IdentifierRenameList.push({
        pattern: searchIdentifier,
        declaration: declareCode
    });
}

function parse() {
    const aliases = Config['Alias'];
    for (const encodedSearch in aliases) {
        const encodedRename = aliases[encodedSearch];
        parseAlias(encodedSearch, encodedRename);
    }

    const declares = Config['Declare'];
    for (const encodedSearch in declares) {
        const declarationCode = declares[encodedSearch];
        parseDeclare(encodedSearch, declarationCode);
    }

    IdentifierRenameList.sort((a, b) => b.pattern.length - a.pattern.length);
}

parse();