//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier, Program} from 'estree';
import {builders as b, is, NodePath, traverse} from 'estree-toolkit';
import {ESTree, parseScript} from 'meriyah';

import {IdentifierRenameList} from './config';
import {MeriyahParseOptions} from './helpers';
import {
    collapseIdentifier, expandIdentifier, findListEntryForIdentifier, IdentifierNode
} from './identifier';

export interface ExtraDeclaration {
    Program: ESTree.Program;
    Identifier: Identifier;
}

const g_kExtraDeclarations = new Map<string, ExtraDeclaration>();

export function renameNode(path: NodePath<IdentifierNode>) {
    const rule = findListEntryForIdentifier(IdentifierRenameList, path);
    if (!rule) {
        return;
    }

    const node = path.node;
    const nodeIdent = collapseIdentifier(node);
    if (nodeIdent === false) return;

    if ('declaration' in rule) {
        let declaration = g_kExtraDeclarations.get(rule.encodedPattern);
        if (!declaration) {
            const declCode = rule.declaration;
            const declProgram = parseScript(declCode, MeriyahParseOptions);
            const declBody = declProgram.body;
            if (declBody.length > 1) {
                throw Error('More than one declaration is not allowed in Declare config.');
            }

            const programPath = path.findParent<Program>(is.program);
            if (!programPath) {
                throw Error('Program path not found for declaration?');
            }

            let desiredDeclareIdent = `__js_${nodeIdent.join('_')}`;
            desiredDeclareIdent = desiredDeclareIdent.replace(/[0-9]/g, '');
            desiredDeclareIdent = desiredDeclareIdent.toLowerCase();
            let declareIdentPath: NodePath<Identifier>;

            traverse(declProgram, {
                $: {scope: true},

                ArrowFunctionExpression: path => {
                    const node = path.node;
                    const body = is.blockStatement(node.body) ? node.body : b.blockStatement([b.returnStatement(node.body)]);
                    const ident = programPath.scope.generateUidIdentifier(desiredDeclareIdent);
                    path.replaceWith(b.functionDeclaration(ident, node.params, body));
                },

                FunctionDeclaration: path => {
                    declareIdentPath = path.get('id');
                    programPath.unshiftContainer('body', [path.node]);
                    programPath.scope.crawl();
                },

                Literal: path => {
                    if (is.expressionStatement(path.parent)) {
                        const ident = programPath.scope.generateUidIdentifier(desiredDeclareIdent);
                        path.parentPath.replaceWith(b.variableDeclaration('const', [b.variableDeclarator(ident, path.cloneNode())]));
                    }
                },

                VariableDeclaration: path => {
                    programPath.unshiftContainer('body', [path.node]);
                    programPath.scope.crawl();
                },

                VariableDeclarator: path => {
                    const id = path.get('id');
                    if (is.identifier(id)) {
                        declareIdentPath = id;
                    }
                }
            });

            if (!declareIdentPath) {
                console.log(declProgram.body[0]);
                throw Error('Could not extract an identifier from the declaration.');
            }

            declaration = {Program: declProgram, Identifier: declareIdentPath.node};
            g_kExtraDeclarations.set(rule.encodedPattern, declaration);
        }

        path.replaceWith(declaration.Identifier);
        return;
    }

    const newIdent = [];
    for (let i = 0; i < rule.rename.length; i++) {
        const renameItem = rule.rename[i];
        const identItem = nodeIdent[i];
        newIdent.push(renameItem || identItem);
    }

    path.replaceWith(expandIdentifier(newIdent, node));
}

