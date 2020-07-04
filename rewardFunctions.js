

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

// Standard Normal variate using Box-Muller transform.
function gaussianNoise() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
