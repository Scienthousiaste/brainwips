
const TARGET_RADIUS = 0.02; // proportion de la largeur de l'écran

function pToPx(canvas, p, dim) {
    return Math.round(p * ((dim == "w") ? canvas.clientWidth : canvas.clientHeight));
}

export default class Area {
    constructor({ left, top, width, height }, targetNumber, distractorNumber, targetSpeed, canvas, ctx) {
        this.width = width;
        this.height = height;
        this.left = left;
        this.right = this.left + this.width;
        this.top = top;
        this.bottom = this.top + this.height;

        this.targetNumber = targetNumber;
        this.distractorNumber = distractorNumber;
        this.targetSpeed = targetSpeed;
        this.canvas = canvas;
        this.ctx = ctx;

        this.lastIteration = Date.now();
        this.WHquotient = this.canvas.clientWidth / this.canvas.clientHeight;
        this.targets = this.#makeTargets()
    }

    draw() {
        this.#drawBoundaries();
        this.#drawTargets();
    }

    update() {
        const now = Date.now();
        this.dealWithWallCollisions(now);

        // target - target collisions
        // for (const prop in state) {
        //     const area = state[prop];
        //     for (const combination of allCombinationsOf2(area.targets)) {
        //         dealWithPotentialCollision(combination, { canvas: canvas, ctx: ctx }, area);
        //     }
        // }

        
        this.lastIteration = now;
    }

    dealWithWallCollisions(now) {
        const delta = (now - this.lastIteration) / 1000;
    
        for (const target of this.targets) {
            let nextX = target.center.x + target.move.dx * delta * this.targetSpeed; //* window.quotient
            let nextY = target.center.y + target.move.dy * delta * this.targetSpeed;
            
            if (nextX > this.right - TARGET_RADIUS) {
                nextX = this.right - TARGET_RADIUS;
                target.move.dx = target.move.dx * -1;
            }
            if (nextX < this.left + TARGET_RADIUS) {
                nextX = this.left + TARGET_RADIUS;
                target.move.dx = target.move.dx * -1;
            }
            if (nextY > this.bottom - TARGET_RADIUS * this.WHquotient) {
                nextY = this.bottom - TARGET_RADIUS * this.WHquotient;
                target.move.dy = target.move.dy * -1;
            }
            if (nextY < this.top + TARGET_RADIUS * this.WHquotient) {
                nextY = this.top + TARGET_RADIUS * this.WHquotient;
                target.move.dy = target.move.dy * -1;
            }
            target.nextX = nextX;
            target.nextY = nextY;
        }
        for (const target of this.targets) {
            target.center.x = target.nextX;
            target.center.y = target.nextY;
        }
    }

    #drawBoundaries() {
        this.ctx.strokeRect(
            pToPx(this.canvas, this.left, "w"),
            pToPx(this.canvas, this.top, "h"),
            pToPx(this.canvas, this.width, "w"),
            pToPx(this.canvas, this.height, "h")
        );
    }

    #drawTargets() {
        for (const target of this.targets) {
            this.ctx.beginPath();
            this.ctx.fillStyle = target.isTarget ? "red" : "orange";
            this.ctx.arc(
                pToPx(this.canvas, target.center.x, "w"),
                pToPx(this.canvas, target.center.y, "h"),
                pToPx(this.canvas, TARGET_RADIUS, "w"),
                0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    #makeTargets() {
        const targets = [];
        const numberOfStimuli = this.targetNumber + this.distractorNumber;
        let assignedTargetsNumber = 0;

        for (let i = 0; i < numberOfStimuli; i++) {
            let isTarget = false;
            if (assignedTargetsNumber < this.targetNumber) {
                if (Math.random() < ((this.targetNumber - assignedTargetsNumber) / (numberOfStimuli - i))) {
                    assignedTargetsNumber++;
                    isTarget = true;
                }
            }
            targets.push(this.#makeTarget(i, numberOfStimuli, isTarget));
        }
        return targets;
    }

    #makeTarget(indexCurrentStimuli, numberOfStimuli, isTarget) {
        const center = {
            // x: Math.random(),
            x: this.left + this.width * 0.5,
            y: this.top + this.height * ((0.5 + indexCurrentStimuli) / numberOfStimuli)
        }

        const direction = Math.random() * 2 * Math.PI;
        // const direction = (isTarget ? (Math.PI / 2) : (3 * (Math.PI) / 2));

        return {
            center: center,
            isTarget: isTarget,
            move: { dx: Math.cos(direction), dy: Math.sin(direction) }
        }
    }
}