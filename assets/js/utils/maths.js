
export function allCombinationsOf2(array) {
    return array.flatMap(
        (v, i) => array.slice(i+1).map( w => [v, w] )
    );
}

// Expects two points with properties x and y, returns the distance
export function distance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
}

export function slopeFrom2Points(p1, p2) {
    return (p1.x - p2.x) / (p1.y - p2.y);
}

export function midpoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    }
}

export function angleBetweenVectors(v1, v2) {
    return Math.acos(dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2)));
}

export function directionAngle(v) {
    return Math.atan(v.y / v.x);
}

export function dotProduct(v1, v2) {
    let sum = 0;
    for (const dim in v1) {
        sum += v1[dim] * v2[dim];
    }
    return sum;
}

export function magnitude(v) {
    let sum = 0;
    for (const dim in v) {
        sum += v[dim] * v[dim];
    }
    return Math.sqrt(sum);
}