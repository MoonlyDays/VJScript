import {BaseNode} from "estree";

export interface INodeTranslator {
}

export abstract class NodeTranslator<T extends BaseNode> implements INodeTranslator {
    node: T;

    protected constructor(node: T) {
        this.node = node;
    }
}
