import {Program} from "esprima";
import {BaseNode, Literal} from "estree";

export const preprocess = (program: Program) => {
    preprocessNode(program);
    process.exit(0);
}

const preprocessNode = (node: BaseNode) => {
    console.log(node.type);
    tryToGoDeeper(node);
}

const tryToGoDeeper = (node: BaseNode) => {

    for (const k in node) {
        const v = node[k];
        if (!v) continue;

        if (typeof v == "object") {
            if ("type" in v) {
                preprocessNode(v);
                continue;
            }

            if (Array.isArray(v)) {
                for (const item of v) {
                    tryToGoDeeper(item);
                }
            }
        }
    }

}

const PreprocessingMap = {
    Literal: (node: Literal) => {

    }
}

const IdentifierRenameMap
    = new Map([
    ["Math", new Map([
        ["PI", "PI"],
        ["abs", "fabs"],
        ["acos", "acos"],
        // acosh: "acosh",
        ["asin", "asin"],
        // asinh: "asinh",
        ["atan", "atan"],
        ["atan2", "atan2"],
        // atanh: "atanh",
        // cbrt: "cbrt",
        ["ceil", "ceil"],
        // clz32: "clz32",
        ["cos", "cos"],
        // cosh: "cosh",
        ["exp", "exp"],
        // expm1: "expm1",
        ["floor", "floor"],
        // fround: "fround",
        // hypot: "hypot",
        // imul: "imul",
        ["log", "log"],
        ["log10", "log10"],
        // log1p: "log1p",
        // log2: "log2",
        // max: "max",
        // "min": "min"
        ["pow", "pow"],
        // random: "random",
        // "round": "round",
        // sign: "sign",
        ["sin", "sin"],
        // sinh: "sinh",
        ["sqrt", "sqrt"],
        ["tan", "tan"],
        // tanh: "tanh",
        // trunc: "trunc"}
    ])]
]);
