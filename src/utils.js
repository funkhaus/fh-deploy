// flatten n-dimensional array
// https://stackoverflow.com/a/15030117/3856675
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

module.exports.flatten = flatten
