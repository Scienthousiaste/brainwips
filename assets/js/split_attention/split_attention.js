import select from "../utils/select";

/*
    Goal:
    - create all the HTML elements in "experiments" from JS 
    - give control to change all/most parameters
    - the styling is done through CSS classes, no change of the style property
    
    To answer:
    - use non pixel units and draw simulation result on an HTML canvas?
*/

const TARGET_NUMBER = 3;
const TARGET_RADIUS = 50;

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


function initState() {

    /*
    - make and position + give orientation targets and distractors

    */
   return {}
}


export function initSplitAttention1() {
    
    const state = initState();
    
    draw(state);

    // setUpCanvas();


    // canvas = document.getElementsByClassName("canvas_hangman")[0];
    // ctx = canvas.getContext('2d');
    // ctx.translate(0.5, 0.5);
}


function strokeRectangle(cc, l, t, w, h) {
    cc.ctx.strokeRect(
        pToPx(cc.canvas, l, "w"),
        pToPx(cc.canvas, t, "h"),
        pToPx(cc.canvas, w, "w"),
        pToPx(cc.canvas, h, "h")
    )
}

function pToPx(canvas, p, dim) {
    return Math.round(p * ((dim == "w") ? canvas.clientWidth : canvas.clientHeight));
}

function drawAreas(cc) {
    // fillRect(x, y, width, height)
    
    // Draws a filled rectangle.
    // strokeRect(x, y, width, height)
    
    // Draws a rectangular outline.

    const areaParams = {
        w: 0.15,
        h: 0.7,
        left: 0.25
    }
    areaParams.top = (1 - areaParams.h) / 2;

    strokeRectangle(cc, 
        areaParams.left, areaParams.top, areaParams.w, areaParams.h
    )

    strokeRectangle(cc, 
        (1 - areaParams.left - areaParams.w),
        areaParams.top,
        areaParams.w,
        areaParams.h
    )

}

function draw(state) {
    const canvas = select("canvas").elem;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');

    drawAreas({canvas: canvas, ctx: ctx});
}