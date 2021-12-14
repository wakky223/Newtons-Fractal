//listen for keypresses
window.onkeypress = function(event) {
    if (event.keyCode == 48) {
        scale *= 0.5;
        console.log(scale);
    } else if(event.keyCode == 57){
        scale *= 2;
        console.log(scale);
    }else if(event.keyCode == 49){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        w.postMessage({ 
            rZero: [1,-0.5], 
            iZero: [0,0.8660254037844386467637232],
            scale: scale,
            maxiterations: 200,
            shadingCoeficient: 10,
            width: c.width,
            height: c.height,
            id: id,
        });
    }else if(event.keyCode == 50){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        w.postMessage({ 
            rZero: [-1.769292354238631415240409,0.8846461771193157076202047], 
            iZero: [0,0.5897428050222055016472807],
            scale: scale,
            maxiterations: 200,
            shadingCoeficient: 10,
            width: c.width,
            height: c.height,
            id: id,
        });
    }else if(event.keyCode == 51){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        w.postMessage({ 
            rZero: [1,0], 
            iZero: [0,1],
            scale: scale,
            maxiterations: 200,
            shadingCoeficient: 10,
            width: c.width,
            height: c.height,
            id: id,
        });
    }else if(event.keyCode == 52){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        w.postMessage({ 
            rZero: [math.random()*10,math.random()*10], 
            iZero: [0,math.random()*10],
            scale: scale,
            maxiterations: 200,
            shadingCoeficient: 10,
            width: c.width,
            height: c.height,
            id: id,
        });
    }else if(event.keyCode == 53){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        w.postMessage({ 
            rZero: [math.random()*10,math.random()*10], 
            iZero: [math.random()*10,math.random()*10],
            scale: scale,
            maxiterations: 200,
            shadingCoeficient: 10,
            width: c.width,
            height: c.height,
            id: id,
        });
    }
}   

//create the web worker
const w = new Worker("worker.js");

//setup worker message 
w.onmessage = function(e) {
    if(typeof e.data == "number"){
    document.getElementById("innerBar").style.width = e.data + 1 +  "px";
    }else if(typeof e.data == "object"){
        ctx.putImageData(e.data, 0, 0);
    }
}

var c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight-7;
var scale = 0.005;
var elem = document.getElementById("innerBar");


ctx = c.getContext("2d");
var id = ctx.createImageData(c.width,c.height);
console.log('done');