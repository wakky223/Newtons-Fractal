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
    for(let i = 0; i < r.length;i++){
        if( ((r[i] % 1) * (r[i] % 1)) % 1 < 0.000001 || ((r[i] % 1) * (r[i] % 1)) > 1 - 0.000001){
            r[i] = math.round(r[i]);
        }
    }
    return r;
}

//takes the derivitave of a given polynomial
function derivitive(p){
    let r = new Array(p.length - 1).fill(0); 
    for (let i = 0; i < p.length-1; i++) {
        r[i] = p[i+1]*(i+1);
    }
    return r;
}

//evaluates a polynomial at a given input
function eval(p, input) {
    let r = math.complex(p[0],0);
    let x = input;
    r = math.add(r,math.multiply(p[1] , input));
        for (let i = 2; i < p.length; i++) {
            x = math.multiply(x,input)
            r = math.add(r,math.multiply(p[i] , x));
        }
    return r;
}

//does one iteration of newtons method
function iterate (v,p,d){
    let r = eval(p,v);
    r.re = -r.re;
    r.im = -r.im;
    r = math.divide(r,eval(d,v));
    r.re += v.re;
    r.im += v.im;
    return r; 
}


//iterates newtons method
function newtonsMethod (v,p,d,rZero,iZero){
    iterations = maxiterations/2
    for(let i = 0;i < iterations;i++ ){
        v = iterate(v,p,d);
        v = iterate(v,p,d);
        let distance = new Array(); 
        for(let i = 0; i < rZero.length; i++){
            distance[i] = math.sqrt( ((rZero[i]-v.re) * (rZero[i]-v.re)) + (iZero[i]-v.im) * (iZero[i]-v.im));
        }
        for(let i = 0; i < rZero.length; i++){
            distance[i + rZero.length] = math.sqrt( ((rZero[i]-v.re) * (rZero[i]-v.re)) + (-iZero[i]-v.im) * (-iZero[i]-v.im));
        } 
        if(math.min(distance) < 0.01){
            i = iterations;
        }
    }
    return v;
}

function nearRoot(v,rZero,iZero){
    let distance = new Array(); 
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
function setScreen(rZero,iZero){
    console.time('drawFractal');
    p = createPolynomial([],rZero,iZero);
    document.getElementById("div").innerHTML = polyToString(p);
    polyToString(p);
    var id = ctx.createImageData(c.width,c.height);
    var d = derivitive(p);
    iterations = maxiterations/2
    var pixels = id.data;
    for(let x = 0; x < c.width; x++){
        for(let y = 0; y < c.height; y++){
            iterant = math.complex(scale * (x - h), -scale * (y - k));

            //iterate newtons method
            let distance = new Array(); 
            for(let i = 0;i < iterations;i++ ){
                iterant = iterate(iterant,p,d);
                iterant = iterate(iterant,p,d);
                for(let i = 0; i < rZero.length; i++){
                    distance[i] = math.sqrt( ((rZero[i]-iterant.re) * (rZero[i]-iterant.re)) + (iZero[i]-iterant.im) * (iZero[i]-iterant.im));
                }
                for(let i = 0; i < rZero.length; i++){
                    distance[i + rZero.length] = math.sqrt( ((rZero[i]-iterant.re) * (rZero[i]-iterant.re)) + (-iZero[i]-iterant.im) * (-iZero[i]-iterant.im));
                } 
                if(math.min(distance) < 0.00001){
                    var shading = i;
                    i = iterations;
                }
            }
            //set the color for the pixel
            const closestRoot = math.min(distance);
            if(closestRoot < 0.00001 ){
                var g =  distance.indexOf(closestRoot) * 63.75;
                var r = 80 + shading * shadingCoeficient;
                var b = 80 + shading * shadingCoeficient;
            }else{
                var r = 0;
                var g = 0;
                var b = 0;
            }

            var offset = (y * id.width + x) * 4;
            pixels[offset] = r;
            pixels[offset + 1] = g;
            pixels[offset + 2] = b;
            pixels[offset + 3] = 255;
        }
        console.log(((x/c.width) * 100 ));
    }
    ctx.putImageData(id, 0, 0);
    console.timeEnd('drawFractal');
}

//converts a polynomial to a string
function polyToString(p){
    let str = ""
    if(p[p.length-1] == 1){
        str = "x<sup>" + (p.length-1) + "</sup>"; 
    }else if(p[p.length-1] == -1){
        str = "- x<sup>" + (p.length-1) + "</sup>"; 
    }else{
    str = p[p.length-1] + "x<sup>" + (p.length-1) + "</sup>";
    }
    for(let i = p.length-2; i > 1; i--){
        if(p[i] == 1){
            str += " + x<sup>" + i + "</sup>"; 
        }else if(p[i] == -1){
            str += " - x<sup>" + i + "</sup>"; 
        }else if(p[i] > 0){
            str += " + " + p[i] + "x<sup>" + i + "</sup>";
        } else if(p[i] < 0){
            str += " - " + -p[i] + "x<sup>" + i + "</sup>";
        }
    }
    if(p[1] == 1){
        str += " + x"; 
    }else if(p[1] == -1){
        str += " - x"; 
    }else if(p[1] > 0){
        str += " + " + p[1] + "x" ;
    } else if(p[1] < 0){
        str += " - " + -p[1] + "x";
    }
    
    if(p[0] > 0){
        str += " + " + p[0];
    } else if(p[0] < 0){
        str += " - " + -p[0];
    }
    return str;
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

console.log('done');

var c = document.getElementById("canvas");
ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

var scale = 0.005;
var h = c.width/2;
var k = c.height/2;
var maxiterations = 200;
var shadingCoeficient = 10;