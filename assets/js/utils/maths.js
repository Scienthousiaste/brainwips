
export function allCombinationsOf2(array) {
    return array.flatMap(
        (v, i) => array.slice(i+1).map( w => [v, w] )
    );
}

// Expects two points with properties x and y, returns the distance
export function distance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
}