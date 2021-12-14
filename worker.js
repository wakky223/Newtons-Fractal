
import "https://unpkg.com/mathjs@9.5.1/lib/browser/math.js";

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
    iterations = e.data.maxiterations/2
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
    document.getElementById("menu").innerHTML = polyToString(p);
    var pixels = e.data.id.data;
    polyToString(p);
    var d = derivitive(p);
    iterations = e.data.maxiterations/2;
    for(let x = 0; x < e.data.width; x++){
        for(let y = 0; y < e.data.height; y++){
            iterant = math.complex(e.data.scale * (x - e.data.h), -e.data.scale * (y - e.data.k));
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
                var r = 80 + shading * e.data.shadingCoeficient;
                var b = 80 + shading * e.data.shadingCoeficient;
            }else{
                var r = 0;
                var g = 0;
                var b = 0;
            }

            var offset = (y * e.data.width + x) * 4;
            e.data.pixels[offset] = r;
            e.data.pixels[offset + 1] = g;
            e.data.pixels[offset + 2] = b;
            e.data.pixels[offset + 3] = 255;
        }
        postMessage(x);
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

onmessage = function(e) {
    a = setScreen(e.data.rZero,e.data.iZero);
    postMessage(a);
}