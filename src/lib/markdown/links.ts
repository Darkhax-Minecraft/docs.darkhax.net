import type {Root} from 'mdast';
import type {Plugin, Transformer} from 'unified';
import {visit} from 'unist-util-visit';
import {gameVersion} from "../../properties.ts";

export function betterLink(): Plugin<[], Root> {

    const transformer: Transformer<Root> = (tree, file) => {
        visit(tree, (node, index, parent) => {
            if (parent && index !== undefined && node.type === 'link') {
                // Relative urls should be prefixed with the site url.
                if (node.url.startsWith('/')) {
                    node.url = `/${gameVersion}${node.url}`
                }
                // External links should always open in a new window.
                else if (node.url.startsWith('http')) {
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