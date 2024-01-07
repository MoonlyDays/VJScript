import {NodeHandler, TraverseState} from './NodeHandler';
import {ExportAllDeclaration} from 'estree';
import {builders as b, NodePath} from 'estree-toolkit';

export default class extends NodeHandler<ExportAllDeclaration> {
    handlePrepare(path: NodePath<ExportAllDeclaration>, state: TraverseState) {

        const node = path.node;
        if (node.exported) {
            path.insertBefore([

                b.importDeclaration([
                    b.importNamespaceSpecifier(node.exported)
                ], node.source)
            ]);
        }

        path.remove();
    }
}