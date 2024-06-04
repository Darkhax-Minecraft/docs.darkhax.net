import type {Node, RootContent, Root} from 'mdast';
import type {Plugin, Transformer} from 'unified';
import type {CurseWidgetData, CurseWidgetMember} from "./types.ts";
import {gameVersion} from '../../properties.ts'
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

function buildNode(project: CurseWidgetData): RootContent {

    const externalLinkAttributes = {
        target: '_blank',
        rel: 'noopener noreferrer'
    }

    return div({
            class: 'cf-project-banner',
            'data-pagefind-ignore': true
        },
        hyperlink(project.urls.curseforge, externalLinkAttributes, img(project.thumbnail, project.summary, {
            class: 'cf-project-banner-logo',
            width: '128px',
            height: '128px'
        })),
        paragraph('cf-project-banner-text',
            text("This documentation is for the "),
            link(project.urls.curseforge, project.title, externalLinkAttributes),
            text(" mod! You can download the mod "),
            link(`${project.urls.curseforge}/files/all?version=${gameVersion}`, "here", externalLinkAttributes),
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