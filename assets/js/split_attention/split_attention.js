import select from "../utils/select";

const TARGET_RADIUS = 0.02;


/*
    Target object:
    - center - {x, y}, between 0 and 1
    - isTarget - boolean
    - direction - number between 0 and 2PI
*/

function makeTarget(indexCurrentStimuli, numberOfStimuli, isTarget) {
    // by fixing the y coordinate, we won't have collisions
    const center = {
        x: Math.random(),
        y: (0.5 + indexCurrentStimuli) / numberOfStimuli
    }
    return {
        center: center,
        isTarget: isTarget,
        direction: Math.random * 2 * Math.PI
    }
}

function makeAreaTargets(targetNumber, distractorNumber) {
    const targets = [];
    const numberOfStimuli = targetNumber + distractorNumber;
    let assignedTargetsNumber = 0;

    for (let i = 0; i < numberOfStimuli; i++) {
        let isTarget = false;
        if (assignedTargetsNumber < targetNumber) {
            if (Math.random() < ((targetNumber - assignedTargetsNumber) / (numberOfStimuli - i))) {
                assignedTargetsNumber++;
                isTarget = true;
            }
        }
        targets.push(makeTarget(i, numberOfStimuli, isTarget));
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

    draw({ canvas: canvas, ctx: ctx }, state);
}

function strokeRectangle(cc, area) {
    cc.ctx.strokeRect(
        pToPx(cc.canvas, area.left, "w"),
        pToPx(cc.canvas, area.top, "h"),
        pToPx(cc.canvas, area.w, "w"),
        pToPx(cc.canvas, area.h, "h")
    )
}

function drawTargets({ canvas: canvas, ctx: ctx }, area) {
    const quotient = canvas.clientWidth / canvas.clientHeight;

    for (const target of area.targets) {
        const x = pToPx(canvas, area.left + TARGET_RADIUS + (target.center.x) * (area.w - 2 * TARGET_RADIUS), "w");
        const y = pToPx(canvas, area.top + TARGET_RADIUS * quotient + (target.center.y) * (area.h - 2 * TARGET_RADIUS * quotient), "h");

        ctx.beginPath();
        ctx.fillStyle = target.isTarget ? "red" : "orange";
        ctx.arc(x, y, pToPx(canvas, TARGET_RADIUS, "w"), 0, 2 * Math.PI);
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