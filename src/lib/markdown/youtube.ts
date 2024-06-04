import type {Root} from 'mdast';
import type {Plugin, Transformer} from 'unified';
import {visit} from 'unist-util-visit';
import {isDirective, isLeafDirective, div, iframe} from "./md-utils.ts";

const defaultOptions = {

    // The ID of the video. https://www.youtube.com/embed/{video}
    video: "dQw4w9WgXcQ",

    // Toggles if autoplay is enabled or not. 0 = disabled.
    autoplay: "0",

    // The player color. Only red and white are allowed.
    color: "red",

    // Toggles if video controls are enabled. 1 = enabled.
    controls: "1",

    // Toggles if keyboard controls are disabled. 0 = enabled.
    disablekb: "0",

    // The seconds to start the video at.
    start: "0",

    // The seconds to end the video at. -1 = no end time.
    end: "-1",

    // Toggles if the user can make the video full screen or not. 1 = enabled
    fs: "1",

    // Toggles if the video should loop or not. 0 = no loop
    loop: "0",

    // Toggles if YouTube will recommend other videos after the video is done. 0 = same channel, 1 = anyone.
    rel: "0",

    // Toggles if picture in picture is enabled. 0 = disabled.
    pip: "0",

    // Toggles if the video is vertical or horizontal. Default is horizontal but shorts should switch this.
    vertical: "0"
}

function buildUrl(options: any): string {

    let url = `https://www.youtube.com/embed/${options.video}`;
    let params: any = {};

    if (options.autoplay === "1") {
        params.options = "1";
    }

    if (options.color !== "red") {
        params.color = options.color;
    }

    if (options.controls === "0") {
        params.controls = "0";
    }

    if (options.disablekb === "1") {
        params.disablekb = "1";
    }

    if (options.start !== "0") {
        params.start = options.start;
    }

    if (options.end !== "-1") {
        params.end = options.end;
    }

    if (options.fs === "0") {
        params.fs = "0";
    }

    if (options.loop === "1") {
        params.loop = "1";
    }

    params.rel = options.rel;
    return `${url}?${new URLSearchParams(params).toString()}`
}

export function youtubeDirective(): Plugin<[], Root> {

    const transformer: Transformer<Root> = (tree, file) => {
        visit(tree, (node, index, parent) => {
            if (parent && index !== undefined && isDirective(node) && node.name.toLowerCase() === 'youtube') {
                if (!isLeafDirective(node)) {
                    file.fail(`Encountered invalid youtube directive! Directive must be a leaf directive. Example: ::youtube[alt_text]{options}`, node);
                    return;
                }
                if (!node.attributes || (!node.attributes.video && !node.attributes.v)) {
                    file.fail(`Encountered invalid youtube directive! No video was specified. Example: ::youtube[alt_test]{v=dQw4w9WgXcQ}`, node)
                    return;
                }
                else {
                    const options = {...defaultOptions, ...node.attributes}
                    if (node.attributes.v) {
                        options.video = node.attributes.v;
                    }
                    parent.children[index] = div(`yt-embed-container ${options.vertical === "0" ? 'yt-embed-h' : 'yt-embed-v'}`, iframe(buildUrl(options), 'yt-embed-video'));
                }
            }
        })
    }

    return function attacher() {
        return transformer;
    }
}