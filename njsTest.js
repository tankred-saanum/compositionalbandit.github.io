// console.log("node test:")
// console.log(process.platform)
//
// var fs = require("fs");
//
//
// let text = {
//     first: [1],
//     second: [32],
//     third: [20]
// }
//
// for (let i = 0; i<50; i++){
//     text.first.push(i *2);
//     text.second.push(i *5);
//     text.third.push(i *10);
// }
//
// let jsonText = JSON.stringify(text);
//
// //console.log(text);
// //console.log(jsonText);
//
// fs.writeFile("myJSON.txt", jsonText, function(err){
//     if (err){
//         console.log(err)
//     }
// });
//
// fs.writeFile("myJSON.csv", jsonText, function(err){
//     if (err){
//         console.log(err)
//     }
// });
//
// fs.writeFile("myJSON.json", jsonText, function(err){
//     if (err){
//         console.log(err)
//     }
// });



// export function rbf(x, parameters){
//     let intercept = parameters[0];
//     let beta = parameters[1];
//     let lengthscale = parameters[2];
//     let optimum = parameters[3];
//     return intercept + (beta* Math.exp(-((optimum-x)**2)/(2*(lengthscale**2))))
// }
//
// let test = []
// let parameters = [-2, 12, 2.6, 7];
// // parameters = [5, 5, 0, 0.5];
// for (let i = 0; i < 100; i++){
//     var u = 0, v = 0;
//     while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
//     while(v === 0) v = Math.random();
//     console.log((Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ))/2)
//     //return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
// }
//
//     let intercept = parameters[0];
//     let beta = parameters[1];
//     let lengthscale = parameters[2];
//     let optimum = parameters[3];
//
//     //let r = intercept + (beta *(Math.sin(i * (periodicity * Math.PI))));
//
//
//
//     let r = intercept + (beta* Math.exp(-((optimum-i)**2)/(2*(lengthscale**2))))
//     test.push(r)
//     console.log(i, ": ", r)
// }
// console.log(test);

//
// let testdict = {};
// testdict["test"] = "hello world";
// let t = "fuck you"
// testdict[t] = ["hey2", "blæht", "bra bra bra"]
// a = testdict[t][1]
//
// console.log(testdict[t], a)
//
// function shuffle(array) {
//   var currentIndex = array.length, temporaryValue, randomIndex;
//
//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;
//
//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }
//
//   return array;
// }
//
// // Used like so
// var arr = [2, 11, 37, 42];
// shuffle(arr);
// console.log(arr);
