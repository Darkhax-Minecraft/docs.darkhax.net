import type {CurseWidgetData} from "./types.ts";
import type {VFile} from "vfile";
import type {Node} from "mdast";

const projectCache = new Map<string, Promise<CurseWidgetData>>();

export async function getProjectData(projectId: string, file: VFile, node: Node): Promise<CurseWidgetData> {
    if (!projectCache.has(projectId)) {
        projectCache.set(
            projectId,
            fetch(`https://api.cfwidget.com/${projectId}`)
                .then<CurseWidgetData>((res) => res.json())
                .then((value) => {
                    console.log(`Caching project ${projectId}`);
                    return value;
                })
                .catch((reason) => file.fail(`Could not get project data. reason=${reason}`, node))
        );
    }
    const ret = projectCache.get(projectId);
    if (!ret) {
        file.fail(`Could not get project data. reason=${projectId}`);
    }
    else {
        return ret;
    }
}