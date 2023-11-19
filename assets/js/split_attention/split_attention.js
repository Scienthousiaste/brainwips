import select from "../utils/select";
import Area from "./area";
import { allCombinationsOf2, distance, directionAngle, midpoint } from "../utils/maths";

const TARGET_RADIUS = 0.02; // proportion de la largeur de l'écran
const TARGET_SPEED = 0.1;
const REFRESH_TIME = 10;
const TARGET_NUMBER = 1;
const DISTRACTOR_NUMBER = 1;

const AREA_HEIGHT = 0.7;
const AREA_WIDTH = 0.15;
const AREA_LEFT = 0.25;

/* 
TODO:
- Réécrire en POO.

- la distance doit surement être qualibré parce que c'est pas la même dans les 2 dimensions
(en tout cas visuellement c'est ce qui ressort)
- util : quand je passe la souris, onhover je montre 1) la position en pixel et en 0-1

- à tester maintenant : dessiner les différentes infos pour voir ce qui se passe
- retirer le idle time des comparaisons de time....
- recalibrer vitesse horizontale/verticale, y'a toujours un soucis
- use requestAnimationFrame?
- use proper object oriented code instead of global variables everywhere
- collisions with other targets
- shouldn't recompute combinations every single time?
*/
class SplitAttention {
    constructor() {
        const canvas = select("canvas").elem;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.areas = [
            new Area({
                left: AREA_LEFT,
                top: (1 - AREA_HEIGHT) / 2,
                width: AREA_WIDTH,
                height: AREA_HEIGHT,
            }, TARGET_NUMBER, DISTRACTOR_NUMBER, TARGET_SPEED, this.canvas, this.ctx),
            new Area({
                left: (1 - AREA_LEFT - AREA_WIDTH),
                top: (1 - AREA_HEIGHT) / 2,
                width: AREA_WIDTH,
                height: AREA_HEIGHT,
            }, TARGET_NUMBER, DISTRACTOR_NUMBER, TARGET_SPEED, this.canvas, this.ctx)
        ];
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.areas.forEach(area => area.draw());
    }

    startMoving() {
        this.lastIteration = Date.now();
        this.interval = setInterval(this.updateAndDraw.bind(this), REFRESH_TIME);
    }

    updateAndDraw() {
        this.areas.forEach(area => area.update());
        this.draw();
    }
}

export function initSplitAttention1() {
    const expe = new SplitAttention();

    //window.expe = expe //(keep a pointer to the object to purge it later)
    expe.draw();
    expe.startMoving();
}

function toAreaSize(globalSize, area) {
    return (globalSize / area.h) - TARGET_RADIUS;
}

function detectCollision(t1, t2, area) {
    // need to call pToPx everywhere before calling distance
    return (distance(t1.center, t2.center) < toAreaSize(TARGET_RADIUS * 2, area));
}

function dealWithPotentialCollision(combination, cc, area) {
    const [t1, t2] = combination;

    if (detectCollision(t1, t2, area)) {


        // need to find which is + and which is -
        // probably need a small addition otherwise they'll keep touching
        // const slope = slopeFrom2Points(t1.center, t2.center);

        const intersection = midpoint(t1.center, t2.center);
        const intersectionDirection = directionAngle({ x: t1.center.x - t2.center.x, y: t1.center.y - t2.center.y }); // angle entre les vecteurs (1, 0) et (t1.x - t2.x, t1.y - t2.y)

        crossPoint(cc, intersection, intersectionDirection, area);

        const newCenterT1 = {
            x: intersection.x,
            y: intersection.y - TARGET_RADIUS * window.quotient
        }
        const newCenterT2 = {
            x: intersection.x,
            y: intersection.y + TARGET_RADIUS * window.quotient
        }

        // const newCenterT1 = {
        //     x: intersection.x + Math.cos(intersectionDirection) * TARGET_RADIUS,
        //     y: intersection.y + Math.sin(intersectionDirection) * TARGET_RADIUS
        // }
        // const newCenterT2 = {
        //     x: intersection.x - Math.cos(intersectionDirection) * TARGET_RADIUS,
        //     y: intersection.y - Math.sin(intersectionDirection) * TARGET_RADIUS
        // }
        // const newCenterT1 = {
        //     x: intersection.x + (t1.center.x > t2.center.x ? -1 : 1) * Math.cos(intersectionDirection) * TARGET_RADIUS,
        //     y: intersection.y + (t1.center.y > t2.center.y ? -1 : 1) * Math.sin(intersectionDirection) * TARGET_RADIUS
        // }
        // const newCenterT2 = {
        //     x: intersection.x + (t2.center.x >= t1.center.x ? -1 : 1) * Math.cos(intersectionDirection) * TARGET_RADIUS,
        //     y: intersection.y + (t2.center.y >= t1.center.y ? -1 : 1) * Math.sin(intersectionDirection) * TARGET_RADIUS
        // }

        // alert("stop")
        // debugger
        t1.center = { ...newCenterT1 };
        t2.center = { ...newCenterT2 };

        // on ajoute le vecteur dx, dy à l'autre


        /*
        il faut :
        - calculer le nouveau vecteur de déplacement
        - le normaliser

        Il me semble qu'il faut repasser par "direction", en tout cas faut rechopper
        les vecteurs proprement, de manière à ce que l'addition de vecteurs donne 
        pas le même résultat (dans les deux cas on fait la somme)
        */

        // const s = {...t1.move};
        // t1.move = {...t2.move};
        // t2.move = {...s};
        t1.move = { dx: 0, dy: 0 }
        t2.move = { dx: 0, dy: 0 }

        // t1.move = {dx: (t1.move.dx + t2.move.dx)/2, dy: (t1.move.dy + t2.move.dy)/2}
        // t2.move = {dx: (t2.move.dx + t1.move.dx)/2, dy: (t2.move.dy + t1.move.dy)/2}

        // t1.move = {dx: t2.move.dx - t1.move.dx, dy: t2.move.dy - t1.move.dy}
        // t2.move = {dx: t1.move.dx - t2.move.dx, dy: t1.move.dy - t2.move.dy}

        // const saveX = t1.move.dx;
        // t1.move.dx = t2.move.dx;
        // t2.move.dx = saveX;

        // const saveY = t1.move.dy;
        // t1.move.dy = t2.move.dy;
        // t2.move.dy = saveY;
    }
}

function crossPoint({ ctx: ctx, canvas: canvas }, point, line, area) {
    ctx.fillStyle = "black";

    // calculé comme ça, c'est au bon endroit !

    ctx.beginPath();
    ctx.moveTo(
        pToPx(canvas, area.left + TARGET_RADIUS + (point.x - 0.02) * (area.w - 2 * TARGET_RADIUS), "w"),
        pToPx(canvas, area.top + TARGET_RADIUS * window.quotient + (point.y) * (area.h - 2 * TARGET_RADIUS * window.quotient), "h")
    );
    ctx.lineTo(
        pToPx(canvas, area.left + TARGET_RADIUS + (point.x + 0.02) * (area.w - 2 * TARGET_RADIUS), "w"),
        pToPx(canvas, area.top + TARGET_RADIUS * window.quotient + (point.y) * (area.h - 2 * TARGET_RADIUS * window.quotient), "h")
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(
        pToPx(canvas, area.left + TARGET_RADIUS + point.x * (area.w - 2 * TARGET_RADIUS), "w"),
        pToPx(canvas, area.top + TARGET_RADIUS * window.quotient + (point.y - 0.02) * (area.h - 2 * TARGET_RADIUS * window.quotient), "h")
    );
    ctx.lineTo(
        pToPx(canvas, area.left + TARGET_RADIUS + point.x * (area.w - 2 * TARGET_RADIUS), "w"),
        pToPx(canvas, area.top + TARGET_RADIUS * window.quotient + (point.y + 0.02) * (area.h - 2 * TARGET_RADIUS * window.quotient), "h")
    );
    ctx.stroke();

    alert("co")
}