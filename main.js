function draw(rZero,iZero){
    console.log("Scale: " + scale);
    console.log("Max iterations: " + "200");
    console.log("Shading Coeficient: " + 10);
    console.log("Width: " + c.width);
    console.log("Height: " + c.height);
    bar.style.width = "0px";
    barWidth = 0;
    for(let i = 0; i < numThreads;i++){
        var id = ctx.createImageData(Math.ceil(c.width/numThreads),c.height);
        w[i].postMessage({ 
            rZero: rZero, 
            iZero: iZero,
            scale: scale,
            maxiterations: 200,
            shadingCoeficient: 10,
            width: c.width,
            height: c.height,
            id: id,
            h: c.width/2 - (i *(c.width/numThreads)),
            k: c.height/2
        });
    }
}

function init(){
    //create the web worker
    numThreads = window.navigator.hardwareConcurrency;
    w = [];
    for(let i = 0; i < numThreads;i++){
        w[i] = new Worker("worker.js");
    }

    //setup worker onmessage function 
    for(let i = 0; i < numThreads;i++){
        w[i].onmessage = function(e) {
            if(typeof e.data == 'undefined'){
            barWidth++;
            bar.style.width = barWidth + "px";
            }else if(typeof e.data == "object"){
                ctx.putImageData(e.data, Math.ceil(c.width/numThreads) * i, 0);
            }else if(typeof e.data == "string"){
                document.getElementById("menu").innerHTML = e.data;
            }
        }
    }
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
        init();
        draw([1,-0.5],[0,0.8660254037844386467637232]);
    }else if(event.keyCode == 50){
        init();
        draw([-1.769292354238631415240409,0.8846461771193157076202047],[0,0.5897428050222055016472807]);
    }else if(event.keyCode == 51){
        init();
        draw([1,0],[0,1]);
    }else if(event.keyCode == 52){
        init();
        draw([math.random()*10,math.random()*10],[0,math.random()*10]);
    }else if(event.keyCode == 53){
        init();
        draw([math.random()*10,math.random()*10],[math.random()*10,math.random()*10]);
    }
}   


//setup canvas element
var c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight-7;
ctx = c.getContext("2d");


//initialize scale & progress bar 
var scale = 0.005;
var bar = document.getElementById("innerBar");
var barWidth = 0;

console.log('Ready.');