import select from "../utils/select";

/*
    Goal:
    - create all the HTML elements in "experiments" from JS 
    - give control to change all/most parameters
    - the styling is done through CSS classes, no change of the style property
    
    Have a "focus" component, that will open a wide modal with the experience/simulation inside?

    To answer:
    - use non pixel units and draw simulation result on an HTML canvas?
*/

const TARGET_NUMBER = 3;
const TARGET_RADIUS = 50;

if (document.querySelector(".split-attention-page")) {
    initSplitAttention();
    select(".start-split-attention").on("click", onClickStartSplitAttention);
}

function onClickStartSplitAttention() {
    alert("hi")
}

function initSplitAttention() {
    ["left", "right"].map(selectClass => addTargetsAndInit(selectClass));
}

function addTargetsAndInit(selectClass) {
    const container = document.querySelector(".split-attention-page ." + selectClass);
    for (let i = 0; i < TARGET_NUMBER; i++) {
        addTarget(container);
    }
}

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function addTarget(container) {
    const center = {
        x: getRandomInt(TARGET_RADIUS, container.clientWidth - TARGET_RADIUS),
        y: getRandomInt(TARGET_RADIUS, container.clientHeight - TARGET_RADIUS)
    }

    //TODO : use my lib
    const newTarget = document.createElement("div");
    newTarget.setAttribute("class", "target");

    // debugger
    newTarget.style.left = center.x + "px";
    newTarget.style.top = center.y + "px";

    container.appendChild(newTarget);
}