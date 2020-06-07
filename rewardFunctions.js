

// Reward functions:
// RBF
export function rbf(x, parameters){
    let intercept = parameters[0];
    let beta = parameters[1];
    let lengthscale = parameters[2];
    let optimum = parameters[3];

    return intercept + (beta* Math.exp(-((optimum-x)**2)/(2*(lengthscale**2))))
}


//Linear
export function linear(x, parameters) {
    let intercept = parameters[0];
    let beta = parameters[1];
    return intercept + (beta * x);

}

export function periodic(x, parameters) {
    let intercept = parameters[0];
    let beta = parameters[1];
    let shift = parameters[2];
    let periodicity = parameters[3];

    return intercept + (beta * (Math.sin(x * (periodicity * Math.PI))));
}

export function sawtooth(x, parameters) {
    let intercept = parameters[0];
    let beta = parameters[1];
    if (x%2 != 0){
        return intercept + beta
    } else {
        return intercept - beta
    }

}

// Linear + periodic / 2
export function linearPeriodic(x, params){
    let params1 = params[0];
    let params2 = params[1];
    return (linear(x, params1) + periodic(x, params2))/2
}

// linear + rbf / 2
export function linearRbf(x, params){
    let params1 = params[0];
    let params2 = params[1];
    return (linear(x, params1) + rbf(x, params2))/2
}

// periodic + rbf /2
export function periodicRbf(x, params){
    let params1 = params[0];
    let params2 = params[1];
    return (periodic(x, params1) + rbf(x, params2))/2
}

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
