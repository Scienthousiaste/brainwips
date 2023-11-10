/* should put these 2 functions in a same lib */
import create from "../utils/create";
import select from "../utils/select";

import {initSplitAttention1} from "../split_attention/split_attention"

select(".focus-prompt").on("click", focusOnExpe);

const expe = {
    "split-attention-1": initSplitAttention1
}

function focusOnExpe(e) {
    // TODO: check if this works 
    // https://stackoverflow.com/questions/33191909/can-i-specify-canvas-dimensions-using-vh-and-vw
    if (!select(".focus-container").elem) {
        const container = create("div", "focus-container")
            .addElement("div", "overlay")
            .addElement("canvas")
            .addElement("button", "quit-button", "exit");
        
        select("body").elem.append(container);
        select(".focus-container .quit-button").on("click", () => container.remove());
        select(".focus-container .overlay").on("click", () => container.remove());
        expe[this.dataset.run]();
    }
}
