//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {NodePath} from 'estree-toolkit';

import Config from '../config.json';
import {NodeAttributes} from './attributes';
import {IdentifierPattern} from './identifier';

export interface SearchPattern {
    pattern: IdentifierPattern;
}

export interface RenameRuleAlias extends SearchPattern {
    rename: IdentifierPattern;
}

export interface RenameRuleDeclare extends SearchPattern {
    declaration: string;
}

export interface AttributeRule extends SearchPattern {
    attributes: NodeAttributes;
}

export type RenameRule = RenameRuleAlias | RenameRuleDeclare;

class ConfigSearchPatternSet<T extends SearchPattern = SearchPattern> extends Set<T> {
    public find(path: NodePath) {

        for (const search of this) {
            const pattern = search.pattern;
            if (pattern.match(path) !== false)
                return search;
        }
    }
}

export const IdentifierRenameList = new ConfigSearchPatternSet<RenameRule>();
export const IdentifierBlackList = new ConfigSearchPatternSet();
export const IdentifierAttributes = new ConfigSearchPatternSet();

function parseSearchPattern<T extends SearchPattern>(encodedSearch: string): T {
    return {pattern: new IdentifierPattern(encodedSearch)} as T;
}

function parseAlias(encodedSearch: string, encodedRename: string) {
    const rule = parseSearchPattern<RenameRuleAlias>(encodedSearch);
    rule.rename = new IdentifierPattern(encodedRename);
    IdentifierRenameList.add(rule);
}

function parseDeclare(encodedSearch: string, declareCode: string) {
    const rule = parseSearchPattern<RenameRuleDeclare>(encodedSearch);
    rule.declaration = declareCode;
    IdentifierRenameList.add(rule);
}

function parseBlacklist(pattern: string) {
    const item = parseSearchPattern(pattern);
    IdentifierBlackList.add(item);
}

function parseAttributes(encodedSearch: string, attributes: NodeAttributes) {
    const item = parseSearchPattern<AttributeRule>(encodedSearch);
    item.attributes = attributes;
    IdentifierAttributes.add(item);
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

    const blacklist = Config['Blacklist'];
    for (const ident of blacklist) {
        parseBlacklist(ident);
    }

    const attributes = Config['Attributes'];
    for (const pattern in attributes) {
        const attribs = attributes[pattern];
        parseAttributes(pattern, attribs);
    }
}

parse();