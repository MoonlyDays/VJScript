import * as path from "path";
import {Program, Syntax} from "esprima";
import {BaseNode, VariableDeclaration} from "estree";

export const toSquirrel = (scriptPath: string, node: Program) => {

    let code =
        '///------------------------------------------------------------\n' +
        '/// This code was automatically generated using VJScript.\n' +
        '/// VJScript is an automatic code translation tool from JavaScript\n' +
        '/// to Squirrel.\n' +
        '/// https://github.com/MoonlyDays/VJScript\n' +
        '///------------------------------------------------------------\n' +
        '/// Source Script: ' + path.basename(scriptPath) + '\n' +
        '///------------------------------------------------------------\n\n';

    code += translateNode(node);
    return code;
}

export const nodeIs = <K extends keyof typeof Syntax>(node: BaseNode, type: K): node is typeof Syntax[K]
{
    return node.
}

export const translateNode = (node: BaseNode) => {


}

