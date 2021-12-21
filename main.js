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
            h: c.width/2 - (i *(c.width/numThreads)) + h,
            k: c.height/2 + k
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
// TODO: fix all of this and turn it into actual menus.
window.onkeypress = function(event) {
    if (event.keyCode == 48) { //0
        scale *= 0.5;
        console.log(scale);
        draw(real,imaginary);
    } else if(event.keyCode == 57){ //9
        scale *= 2;
        console.log(scale);
        draw(real,imaginary);
    }else if(event.keyCode == 49){ //1
        real = [1,-0.5];
        imaginary = [0,0.8660254037844386467637232];
        draw(real,imaginary);
    }else if(event.keyCode == 50){ //2
        real = [-1.769292354238631415240409,0.8846461771193157076202047];
        imaginary = [0,0.5897428050222055016472807];
        draw(real,imaginary);
    }else if(event.keyCode == 51){ //3
        real = [1,0];
        imaginary = [0,1];
        draw(real,imaginary);
    }else if(event.keyCode == 52){ //4
        real = [0.586992498352664,-1.17398499670533,-0.425899821039621,0.851799642079243];
        imaginary = [1.016700830808605,0,0.737680128975117,0];
        draw(real,imaginary);
    }else if(event.keyCode == 53){ //5
        
    }else if(event.keyCode == 54){ //6

    }else if(event.keyCode == 55){ //7
        real = [Math.random()*10,Math.random()*10];
        imaginary = [0,Math.random()*10];
        draw(real,imaginary);
    }else if(event.keyCode == 56){ //8
        real = [Math.random()*10,Math.random()*10];
        imaginary = [Math.random()*10,Math.random()*10];
        draw(real,imaginary);
    }
}   


//setup canvas element
var c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight-7;
ctx = c.getContext("2d");


//initialize scale & progress bar 
var scale = 0.005;
var h = 0;
var k = 0;
var bar = document.getElementById("innerBar");
var barWidth = 0;

var real = [1,-0.5];
var imaginary = [0,0.8660254037844386467637232];
init();

console.log('Ready.');