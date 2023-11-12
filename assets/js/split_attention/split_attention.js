import select from "../utils/select";

/*
    Target object:
    - center - {x, y}, between 0 and 1
    - isTarget - boolean
    - direction - number between 0 and 2PI
*/

function makeTarget(isTarget) {
    const center = {
        x: Math.random(),
        y: Math.random()
    }
    return {
        center: center,
        isTarget: isTarget,
        direction: Math.random * 2 * Math.PI
    }
}

function makeAreaTargets(targetNumber, distractorNumber) {
    const targets = [];
    for (let i = 0; i < (targetNumber + distractorNumber); i++) {
        targets.push(makeTarget(i < targetNumber));
    }
    return targets;
}

function initState() {
    const targetNumber = 1;
    const distractorNumber = 2;
    const areaParams = {
        w: 0.15,
        h: 0.7,
        left: 0.25
    }

    areaParams.top = (1 - areaParams.h) / 2;

    const leftArea = {
        left: areaParams.left,
        top: areaParams.top,
        w: areaParams.w,
        h: areaParams.h,
        targets: makeAreaTargets(targetNumber, distractorNumber)
    };
    
    const rightArea = {
        left: (1 - areaParams.left - areaParams.w),
        top: areaParams.top,
        w: areaParams.w,
        h: areaParams.h,
        targets: makeAreaTargets(targetNumber, distractorNumber)
    }

    return {
        left: leftArea,
        right: rightArea
    }
}

export function initSplitAttention1() {
    const state = initState();
    const canvas = select("canvas").elem;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');
    
    draw({canvas: canvas, ctx: ctx}, state);
}

function strokeRectangle(cc, area) {
    cc.ctx.strokeRect(
        pToPx(cc.canvas, area.left, "w"),
        pToPx(cc.canvas, area.top, "h"),
        pToPx(cc.canvas, area.w, "w"),
        pToPx(cc.canvas, area.h, "h")
    )
}

function drawTargets({canvas: canvas, ctx: ctx}, area) {
    const targetRadius = 0.02;

    for (const target of area.targets) {
        const x = pToPx(canvas, area.left + (target.center.x) * area.w, "w");
        const y = pToPx(canvas, area.top + (target.center.y) * area.h, "h");

        ctx.beginPath();
        ctx.arc(x, y, pToPx(canvas, targetRadius, "w"), 0, 2* Math.PI);
        ctx.fill();
    }
}

function pToPx(canvas, p, dim) {
    return Math.round(p * ((dim == "w") ? canvas.clientWidth : canvas.clientHeight));
}

function draw(cc, state) {
    for (const prop in state) {
        const area = state[prop];
        strokeRectangle(cc, area);
        drawTargets(cc, area);
    }
}