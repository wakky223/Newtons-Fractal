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
        setScreen([1,-0.5],[0,0.8660254037844386467637232]);
    }else if(event.keyCode == 50){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        setScreen([-1.769292354238631415240409,0.8846461771193157076202047],[0,0.5897428050222055016472807]);
    }else if(event.keyCode == 51){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        setScreen([1,0],[0,1]);
    }else if(event.keyCode == 52){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        setScreen([math.random()*10,math.random()*10],[0,math.random()*10]);
    }else if(event.keyCode == 53){
        console.log("Scale: " + scale);
        console.log("Drawing: ");
        setScreen([math.random()*10,math.random()*10],[math.random()*10,math.random()*10]);
    }
}   

const w = new Worker("worker.js");

w.onmessage = function(e) {
    if(typeof e.data == "number"){
    document.getElementById("innerBar").style.width = e.data + "px";
    console.log(e + "% updated")
    }else if(typeof e.data == "object"){
        ctx.putImageData(e.data, 0, 0);
    }
}

var c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight-7;

var elem = document.getElementById("innerBar");



console.log('done');
ctx = c.getContext("2d");
var id = ctx.createImageData(c.width,c.height);
w.postMessage({ 
    rZero: [1,-0.5], 
    iZero: [0,0.8660254037844386467637232],
    scale: 0.005,
    h: c.width/2,
    k: c.height/2,
    maxiterations: 200,
    shadingCoeficient: 10,
    width: c.width,
    height: c.height,
    id: id,
})
