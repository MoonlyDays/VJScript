//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';
import {ESTree} from 'meriyah';

import * as Dictionary from '../data/dictionary';
import {ConfigSearchPatternSet, IdentifierPattern, parseSearchPattern, SearchPattern} from './identifier';
import {polyfillFromString} from './polyfill';

export interface DictionaryDeclaration {
    Program: ESTree.Program;
    Identifier: Identifier;
}

const IdentifierDictionary = new ConfigSearchPatternSet<RenameRule>();

export function renameNode(path: NodePath) {

    const rule = IdentifierDictionary.find(path);
    if (!rule)
        return;

    const nodePattern = IdentifierPattern.fromPath(path);
    if (nodePattern.hasBinding(path))
        return;

    // Given rule is a declaration.
    if ('declaration' in rule) {
        createDeclaration(path, rule);
        return;
    }

    renameInline(path, rule);
}

const renameInline = (path: NodePath, rule: RenameRuleInline) => {
    const match = rule.pattern.match(path);

    const renamedPattern = new IdentifierPattern();
    for (const item of rule.rename.items) {

        if (typeof item == 'string' && item.startsWith('$')) {
            const idx = Number(item.slice(1));
            renamedPattern.push(...match[idx]);
            continue;
        }

        renamedPattern.push(item);
    }

    const node = renamedPattern.codeGenerate();
    path.replaceWith(node);
};

const createDeclaration = (path: NodePath, rule: RenameRuleDeclaration) => {

    const ident = rule.pattern.items.join('_');
    const polyfill = polyfillFromString(path, ident, rule.declaration);

    if (is.identifier(path)) {
        if (path.node.name == polyfill.Identifier)
            return;
    }

    path.replaceWith(b.identifier(polyfill.Identifier));
};


function parseAlias(encodedSearch: string, encodedRename: string) {
    const rule = parseSearchPattern<RenameRuleInline>(encodedSearch);
    rule.rename = new IdentifierPattern(encodedRename);
    IdentifierDictionary.add(rule);
}

function parseDeclare(encodedSearch: string, declareCode: string) {
    const rule = parseSearchPattern<RenameRuleDeclaration>(encodedSearch);
    rule.declaration = declareCode;
    IdentifierDictionary.add(rule);
}

export interface RenameRuleInline extends SearchPattern {
    rename: IdentifierPattern;
}

export interface RenameRuleDeclaration extends SearchPattern {
    declaration: string;
}

export type RenameRule = RenameRuleInline | RenameRuleDeclaration;

function parse() {
    for (const encodedSearch in Dictionary.Alias) {
        const encodedRename = Dictionary.Alias[encodedSearch];
        parseAlias(encodedSearch, encodedRename);
    }

    for (const encodedSearch in Dictionary.Declare) {
        const declarationCode = Dictionary.Declare[encodedSearch];
        parseDeclare(encodedSearch, declarationCode);
    }
}

parse();