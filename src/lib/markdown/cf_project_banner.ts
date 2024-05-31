import type {Node, RootContent, Root} from 'mdast';
import type {Plugin, Transformer} from 'unified';
import type {CurseWidgetData, CurseWidgetMember} from "./types.ts";
import {getProjectData} from './cf_widget.ts'
import {
    isLeafDirective,
    findDirectives,
    div,
    text,
    img,
    link,
    hyperlink,
    paragraph
} from "./md-utils.ts";

const defaultOptions = {

    projectId: "-1"
}

function buildAuthors(authors: CurseWidgetMember[]): Node[] {

    let output = new Array<Node>();

    authors.map((author, index) => {
        output.push(link(`https://www.curseforge.com/members/${author.username.toLowerCase()}/projects`, author.username, `cf-project-banner-author cf-project-banner-role-${author.title.toLowerCase()}`))
        output.push(text(index === (authors.length - 1) ? '.' : ', '))
    })

    return output;
}

function buildNode(project: CurseWidgetData): RootContent {

    return div({
            class: 'cf-project-banner',
            'data-pagefind-ignore': true
        },
        hyperlink(project.urls.curseforge, {}, img(project.thumbnail, project.summary, {
            class: 'cf-project-banner-logo',
            width: '128px',
            height: '128px'
        })),
        paragraph('cf-project-banner-text',
            text("This documentation is for the "),
            link(project.urls.curseforge, project.title),
            text(" mod! This mod is developed by "),
            ...buildAuthors(project.members),
            text(" You can download the mod "),
            link(project.urls.curseforge, "here"),
            text(".")
        )
    )
}

export function cfProjectBanner(): Plugin<[], Root> {

    const transformer: Transformer<Root> = async (tree, file) => {

        for (let {node, parent, index} of findDirectives('cf-banner', tree)) {
            if (!isLeafDirective(node)) {
                file.fail('Encountered invalid cf-banner! Directive must be leaf directive. Example: ::cf-banner[text]{options}');
                return;
            }
            if (!node.attributes || (!node.attributes.project && !node.attributes.p)) {
                file.fail('Encountered invalid cf-banner! No project ID was specified. Example: ::cf-banner[text]{p=1234}');
            } else {
                const options = {...defaultOptions, ...node.attributes}
                if (node.attributes.p) {
                    options.projectId = node.attributes.p;
                }
                await getProjectData(options.projectId, file, node).then(projectData => parent.children[index] = buildNode(projectData))
            }
        }
    };

    return function attacher() {
        return transformer;
    };
}