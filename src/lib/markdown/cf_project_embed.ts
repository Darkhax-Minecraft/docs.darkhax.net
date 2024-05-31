import type {RootContent, Root} from 'mdast';
import type {Plugin, Transformer} from 'unified';
import type {CurseWidgetData} from "./types.ts";
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

    return div({
            class: 'cf-project-embed',
            'data-pagefind-ignore': true
        },
        hyperlink(project.urls.curseforge, {}, img(project.thumbnail, project.summary, {
            class: 'cf-project-embed-logo',
            width: '128px',
            height: '128px'
        })),
        div('cf-project-embed-info',
            paragraph('cf-project-embed-title',
                link(project.urls.curseforge, project.title)
            ),
            paragraph('cf-project-embed-summary',
                text(project.summary)
            )
        )
    )
}

export function cfProjectEmbed(): Plugin<[], Root> {

    const transformer: Transformer<Root> = async (tree, file) => {

        for (let {node, parent, index} of findDirectives('cf-embed', tree)) {
            if (!isLeafDirective(node)) {
                file.fail('Encountered invalid cf-embed! Directive must be leaf directive. Example: ::cf-embed[text]{options}');
                return;
            }
            if (!node.attributes || (!node.attributes.project && !node.attributes.p)) {
                file.fail('Encountered invalid cf-embed! No project ID was specified. Example: ::cf-embed[text]{p=1234}');
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