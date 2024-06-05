import type {Root} from 'mdast';
import type {Plugin, Transformer} from 'unified';
import {visit} from 'unist-util-visit';
export function betterLink(): Plugin<[], Root> {

    const transformer: Transformer<Root> = (tree, file) => {
        visit(tree, (node, index, parent) => {
            if (parent && index !== undefined && node.type === 'link') {
                // External links should always open in a new window.
                if (node.url.startsWith('http')) {
                    const data = node.data || (node.data = {})
                    if (!data.hProperties) {
                        data.hName = 'a'
                        data.hProperties = {
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        }
                    }
                }
                else {
                    console.warn(`Unhandled URL type ${node.url}`)
                }
            }
        })
    }

    return function attacher() {
        return transformer;
    }
}