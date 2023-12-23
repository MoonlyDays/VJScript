//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import Config from '../config.json';
import {CollapsedIdentifier, decodeIdentifier} from './util';

type RenameRuleShared = {
    pattern: CollapsedIdentifier;
    call_only: boolean;
};

type RenameRuleAlias = RenameRuleShared & {
    rename: CollapsedIdentifier;
};

type RenameRuleDeclare = RenameRuleShared & {
    declaration: string;
};

export type RenameRule =
    RenameRuleAlias |
    RenameRuleDeclare;

export const IdentifierRenameList: RenameRule[] = [];

function parseAlias(encodedSearch: string, encodedRename: string) {
    const rule = parseSearchPattern<RenameRuleAlias>(encodedSearch);
    rule.rename = decodeIdentifier(encodedRename);

    IdentifierRenameList.push(rule);
}

function parseDeclare(encodedSearch: string, declareCode: string) {
    const rule = parseSearchPattern<RenameRuleDeclare>(encodedSearch);
    rule.declaration = declareCode;

    IdentifierRenameList.push(rule);
}

function parseSearchPattern<T extends RenameRuleShared>(encodedSearch: string): T {

    let call_only = false;
    if (encodedSearch.endsWith('()')) {
        encodedSearch = encodedSearch.slice(0, -2);
        call_only = true;
    }

    return {
        pattern: decodeIdentifier(encodedSearch),
        call_only
    } as T;
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