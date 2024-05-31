import {h as _h, s as _s, type Properties as HastProps} from 'hastscript';
import type {Node, Paragraph as P, Heading as H, Text, Image, Html, Link, Parent, Root} from 'mdast';
import type {Properties} from 'hast';
import type {Directives, TextDirective, LeafDirective, ContainerDirective} from 'mdast-util-directive';
import {visit} from 'unist-util-visit';
type HtmlProps = string | Properties;

export function findDirectives(name: string, tree: Root): {
    node: Directives,
    parent: Parent,
    index: number
}[] {

    const foundNodes: { node: Directives; parent: Parent, index: number }[] = [];

    visit(tree, (node, index, parent) => {
        if (parent && index !== undefined && isDirective(node) && node.name.toLowerCase() === name) {
            foundNodes.push({node, parent, index});
        }
    });

    return foundNodes;
}

export function isDirective(node: Node): node is Directives {
    return isTextDirective(node) || isLeafDirective(node) || isContainerDirective(node)
}

// Text directives are also known as inline directives. These are for elements that are inline with the rest of the
// content. For example you could use :style[hello world]{color=red} to make the text red. These should produce span
// html elements.
export function isTextDirective(node: Node): node is TextDirective {
    return node.type === 'textDirective'
}

// Leaf directives are also known as block directives. These are for elements that are not inline with the rest of the
// content. For example an embedded youtube video. For example ::video[title]{file=file.mp4} could embed a video. These
// should produce a div containing the content.
export function isLeafDirective(node: Node): node is LeafDirective {
    return node.type === 'leafDirective'
}

// Container directives are a directive that contains other elements. For example this could make a slideshow of images.
// :::slideshow
// ![](https://example.com/a.png)
// ![](https://example.com/b.png)
// ![](https://example.com/c.png)
// :::
export function isContainerDirective(node: Node): node is ContainerDirective {
    return node.type === 'containerDirective'
}

function resolveProps(attrs: HtmlProps = {}): Properties {
    return (typeof attrs === "string") ? {class: attrs} : attrs;
}

export function div(attrs: HtmlProps = {}, ...children: any[]): P {
    return h('div', resolveProps(attrs), children);
}

export function iframe(src: string, attrs: HtmlProps = {}): P {

    const attributes = resolveProps(attrs);
    attributes.src = src;
    attributes.frameBorder = 0;

    return h('iframe', attributes);
}

export function img(src: string, alt: string, attrs: HtmlProps = {}): Image {
    return {
        type: 'image',
        url: src,
        alt: alt,
        title: alt,
        data: {
            hName: 'img',
            hProperties: resolveProps(attrs)
        }
    }
}

export function paragraph(attrs: HtmlProps = {}, ...children: any[]): P {
    return h('p', resolveProps(attrs), children);
}

export function link(src: string, contents: string, attrs: HtmlProps = {}): Link {
    return hyperlink(src, attrs, text(contents))
}
export function hyperlink(src: string, attrs: HtmlProps = {}, ...children: any[]): Link {

    return {
        type: 'link',
        children: children,
        url: src,
        data: {
            hName: 'a',
            hProperties: resolveProps(attrs)
        }
    }
}

export function text(text: string): Text {
    return {
        type: 'text',
        value: text
    }
}

export function heading(depth: 1 | 2 | 3 | 4 | 5 | 6, textContents: string, attrs: HtmlProps = {}): H {
    return {
        type: 'heading',
        depth: depth,
        data: {
            hName: `h${depth}`,
            hProperties: resolveProps(attrs)
        },
        children: [
            text(textContents)
        ]
    };
}

export function h(el: string, attrs: HastProps = {}, children: any[] = []): P {
    const {tagName, properties} = _h(el, attrs);
    return {
        type: 'paragraph',
        data: {hName: tagName, hProperties: properties},
        children
    };
}

export function s(el: string, attrs: HastProps = {}, children: any[] = []): P {
    const {tagName, properties} = _s(el, attrs);
    return {
        type: 'paragraph',
        data: {
            hName: tagName,
            hProperties: properties
        },
        children
    };
}