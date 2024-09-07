import type {CurseWidgetData} from "./types.ts";
import type {VFile} from "vfile";
import type {Node} from "mdast";

const projectCache = new Map<string, Promise<CurseWidgetData>>();

export async function getProjectData(projectId: string | number, file: VFile | undefined = undefined, node: Node | undefined = undefined): Promise<CurseWidgetData> {
    const id = projectId.toString();
    if (!projectCache.has(id)) {
        projectCache.set(
            id,
            fetch(`https://api.cfwidget.com/${projectId}`)
                .then<CurseWidgetData>((res) => res.json())
                .then((value) => {
                    console.log(`Caching project ${projectId}`);
                    return value;
                })
                .catch((reason) => fail(`Could not get project data. project=${projectId} reason=${reason}`, file, node))
        );
    }
    const ret = projectCache.get(id);
    if (!ret) {
        fail(`Could not get project data. reason=${projectId}`);
    }
    else {
        return ret;
    }
}

function fail(reason: string, file: VFile | undefined = undefined, node: Node | undefined = undefined): never {

    if (file && node) {
        return file.fail(reason, node)
    }
    else {
        console.error(reason)
        throw new Error(reason)
    }
}