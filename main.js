//multiplies two polynoials, inputs are arrays starting at the x^0 term. 
function multiplyPoly(p1,p2){
    let r = new Array(p1.length + p2.length - 1).fill(0);
    for(let i = 0; i < p1.length;i++){
        for(let j = 0; j < p2.length; j++){
            r[i+j] += p1[i] * p2[j];
        }
    }
    return r;
}

//calculates the polynomial that has given complex conjugate zeros
function imaginaryPolynomialZeros(realPart, imaginaryPart) {
    if(imaginaryPart != 0){
        let r = [0, 0, 1];
        r[0] = (realPart * realPart) + (imaginaryPart * imaginaryPart);
        r[1] = -2 * realPart;
        console.log("x^2 + " + r[1] + "x + " + r[0]);
        return r;
    }else{
        return [-realPart,1];
    }

}

//creates a polynomial based on real and imaginary zeros; assumes each complex zero has a conjugate
function createPolynomial(zeros,czerosRP,czerosIP) {
    if (czerosRP.length != czerosIP.length) {
        throw 'Coordinate Pair Exception.';
    }
    let r = new Array(zeros.length + czerosRP.length + czerosIP + 1).fill(0);
    console.log(r);
    if (zeros.length > 0) {
        r[0] = -zeros[0];
        r[1] = 1;
        console.log(r);
        for (let i = 1; i < zeros.length; i++) {
            r = multiplyPoly(r,[-zeros[i], 1]);
        }
        console.log(r);
        for (let i = 0; i < czerosRP.length; i++) {
            r = multiplyPoly(r, imaginaryPolynomialZeros(czerosRP[i], czerosIP[i]));
        }
        console.log(r);
    } else if (czerosRP.length > 0) {
        r = imaginaryPolynomialZeros(czerosRP[0], czerosIP[0]);
        for (let i = 0; i < zeros.length; i++) {
            r = multiplyPoly(r, [-zeros[i], 1]);
        }
        for (let i = 1; i < czerosRP.length; i++) {
            r = multiplyPoly(r, imaginaryPolynomialZeros(czerosRP[i], czerosIP[i]));
        }
    }
    polyToString(r);
    return r;
}

//takes the derivitave of a given polynomial
function derivitive(p){
    let r = new Array(p.length - 1).fill(0); 
    for (let i = 0; i < p.length-1; i++) {
        r[i] = p[i+1]*(i+1);
    }
    polyToString(r);
    return r;
}

//evaluates a polynomial at a given input
function eval(p, input) {
    let r = math.complex(p[0],0);
        for (let i = 1; i < p.length; i++) {
            r = math.add(r,math.multiply(p[i] , math.pow(input,i)));
        }
    return r;
}

//does one iteration of newtons method
function iterate (v,p,d){
    let r = eval(p,v).neg();
    r = math.divide(r,eval(d,v));
    r = math.add(r,v);
    return r; 
}

//iterates newtons method
function newtonsMethod (v,p,iterations){
    d = derivitive(p);
    for(let i = 0;i < iterations;i++ ){
        v = iterate(v,p,d);
    }
    return v;
}

function newtonsMethod (v,p,iterations,d){
    for(let i = 0;i < iterations;i++ ){
        v = iterate(v,p,d);
    }
    return v;
}

function nearRoot(v,rZero,iZero){
    let distance = new Array(rZero.length).fill(0); 
    for(let i = 0; i < rZero.length; i++){
        distance[i] = math.sqrt( ((rZero[i]-v.re) * (rZero[i]-v.re)) + (iZero[i]-v.im) * (iZero[i]-v.im));
    }
    for(let i = 0; i < rZero.length; i++){
        distance[i + rZero.length] = math.sqrt( ((rZero[i]-v.re) * (rZero[i]-v.re)) + (-iZero[i]-v.im) * (-iZero[i]-v.im));
    }
    const min = math.min(distance);
    return distance.indexOf(min);
}

//sets the screen
function setScreen(iterations,rZero,iZero){
    console.time('drawFractal');
    p = createPolynomial([],rZero,iZero);
    var id = ctx.createImageData(c.width,c.height);
    d = derivitive(p);
    var pixels = id.data;
    for(let x = 0; x < c.width; x++){
        for(let y = 0; y < c.height; y++){
            iterant = math.complex(scale * (x - h), -scale * (y - k));
            iterant = newtonsMethod (iterant,p,iterations,d);
            //find closest root
            var g =  nearRoot(iterant,rZero,iZero) * 63.75;
            var r = 100;
            var b = 100;
            var offset = (y * id.width + x) * 4;
            pixels[offset] = r;
            pixels[offset + 1] = g;
            pixels[offset + 2] = b;
            pixels[offset + 3] = 255;
        }
    }
    ctx.putImageData(id, 0, 0);
    console.timeEnd('drawFractal');
}

//for dev purposes, converts a polynomial to a string to compare in other software
function polyToString(p){
    let str = "";
    for(let i = p.length-1; i > 0; i--){
        str += p[i] + "x^" + i + " + ";
    }
    str += p[0];
    console.log(str);
    return str;
}

//listen for enter keypress
window.onkeypress = function(event) {
    if (event.keyCode == 49) {
        console.time('doSomething');
        setScreen(1,[0,50,100],[0,200,500]);
        console.timeEnd('doSomething');
    }
}   

console.log('done');

var c = document.getElementById("canvas");
ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

var scale = 0.005;
var h = c.width/2;
var k = c.height/2;


setScreen(20,[1,-0.5],[0,0.8660254037844386467637232]);
