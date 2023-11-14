import select from "../utils/select";
import { allCombinationsOf2, distance } from "../utils/maths";

const TARGET_RADIUS = 0.02;
const TARGET_SPEED = 0.3;
const REFRESH_TIME = 20;

function makeTarget(indexCurrentStimuli, numberOfStimuli, isTarget) {
    const center = {
        x: Math.random(),
        y: (0.5 + indexCurrentStimuli) / numberOfStimuli
    }

    const direction = Math.random() * 2 * Math.PI;
    return {
        center: center,
        isTarget: isTarget,
        move: {dx: Math.cos(direction), dy: Math.sin(direction)}
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

    cc = { canvas: canvas, ctx: ctx };
    draw(cc, state);
    initInterval(cc, state);
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

function initInterval(cc, state) {
    window.state = state;
    window.lastIteration = Date.now();
    window.splitAttention1Interval = setInterval(updateStateAndReDraw.bind(cc), REFRESH_TIME);
}

function updateStateAndReDraw() {
    updateState(this.canvas);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw({canvas: this.canvas, ctx: this.ctx}, window.state);
}

function detectCollision(t1, t2) {
    return (distance(t1.center, t2.center) < (TARGET_RADIUS * 2));
}

function dealWithPotentialCollision(combination) {
    if (detectCollision(combination[0], combination[1])) {
        
        const saveX = combination[0].move.dx;
        combination[0].move.dx = combination[1].move.dx;
        combination[1].move.dx = saveX;

        const saveY = combination[0].move.dy;
        combination[0].move.dy = combination[1].move.dy;
        combination[1].move.dy = saveY;
    }
}

function updateState(canvas) {
    /* 
    TODO:
    - recalibrer vitesse horizontale/verticale, y'a toujours un soucis
    - use requestAnimationFrame?
    - use proper object oriented code instead of global variables everywhere
    - collisions with other targets
    - shouldn't recompute combinations every single time?
    */

    const now = Date.now();
    const delta = (now - window.lastIteration) / 1000;
    const state = window.state;
    const quotient = canvas.clientWidth / canvas.clientHeight; // to scale horizontal speed so that it's the same as vertical 

    for (const prop in state) {
        const area = state[prop];
        for (const target of area.targets) {
            let nextX = target.center.x + target.move.dx * delta * TARGET_SPEED * quotient;
            let nextY = target.center.y + target.move.dy * delta * TARGET_SPEED;

            // Wall collisions
            if (nextX > 1) {
                nextX = 1;
                target.move.dx = target.move.dx * -1;
            }
            if (nextX < 0) {
                nextX = 0;
                target.move.dx = target.move.dx * -1;
            }
            if (nextY > 1) {
                nextY = 1;
                target.move.dy = target.move.dy * -1;
            }
            if (nextY < 0) {
                nextY = 0;
                target.move.dy = target.move.dy * -1;
            }

            target.nextX = nextX;
            target.nextY = nextY;
        }
    }

    // target - target collisions
    for (const prop in state) {
        const area = state[prop];
        for (const combination of allCombinationsOf2(area.targets)) {
            dealWithPotentialCollision(combination);
        }
    } 

    for (const prop in state) {
        const area = state[prop];
        for (const target of area.targets) {
            target.center.x = target.nextX;
            target.center.y = target.nextY;
        }
    }

    window.lastIteration = now;
    window.state = state;
}