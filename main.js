function draw(rZero,iZero){
    console.log("Scale: " + scale);
    console.log("Max iterations: " + "200");
    console.log("Shading Coeficient: " + shadingCoeficient);
    console.log("Width: " + c.width);
    console.log("Height: " + c.height);
    var id = ctx.createImageData(c.width,c.height);
    w.postMessage({ 
        rZero: rZero, 
        iZero: iZero,
        scale: scale,
        maxiterations: 200,
        shadingCoeficient: 10,
        width: c.width,
        height: c.height,
        id: id,
    });
}

//listen for keypresses
window.onkeypress = function(event) {
    if (event.keyCode == 48) {
        scale *= 0.5;
        console.log(scale);
    } else if(event.keyCode == 57){
        scale *= 2;
        console.log(scale);
    }else if(event.keyCode == 49){
        draw([1,-0.5],[0,0.8660254037844386467637232]);
    }else if(event.keyCode == 50){
        draw([-1.769292354238631415240409,0.8846461771193157076202047],[0,0.5897428050222055016472807]);
    }else if(event.keyCode == 51){
        draw([1,0],[0,1]);
    }else if(event.keyCode == 52){
        draw([math.random()*10,math.random()*10],[0,math.random()*10]);
    }else if(event.keyCode == 53){
        draw([math.random()*10,math.random()*10],[math.random()*10,math.random()*10]);
    }
}   

//create the web worker
const w = new Worker("worker.js");

//setup worker onmessage function 
w.onmessage = function(e) {
    if(typeof e.data == "number"){
    document.getElementById("innerBar").style.width = e.data + 1 +  "px";
    }else if(typeof e.data == "object"){
        ctx.putImageData(e.data, 0, 0);
    }else if(typeof e.data == "string"){
        document.getElementById("menu").innerHTML = e.data;
    }
}

//setup canvas element
var c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight-7;
ctx = c.getContext("2d");
var id = ctx.createImageData(c.width,c.height);

//initialize scale & progress bar 
var scale = 0.005;
var elem = document.getElementById("innerBar");

console.log('Ready.');