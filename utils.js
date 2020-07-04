// function for getting a random float
export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


// function for getting random int, [incluse min, inclusive max]
export function getRandomInt(min, max) {
    // min = Math.ceil(min);
    // max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fischer-Yates shuffle, aka Knuth shuffle
export function shuffle(array){
    var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

    // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;

    }

    return array;
}

export function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}
