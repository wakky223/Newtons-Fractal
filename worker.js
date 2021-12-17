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
            r[i] = Math.round(r[i]);
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
    let r = complex(p[0],0);
    let x = input;
    r = addComplex(r,multiplyComplex(p[1] , input));
        for (let i = 2; i < p.length; i++) {
            x = multiplyComplex(x,input)
            r = addComplex(r,multiplyComplex(p[i] , x));
        }
    return r;
}

//does one iteration of newtons method
function iterate (v,p,d){
    let r = eval(p,v);
    r.re = -r.re;
    r.im = -r.im;
    r = divideComplex(r,eval(d,v));
    r.re += v.re;
    r.im += v.im;
    return r; 
}

function complex(re,im){
    return {re: re,im: im}
}

function addComplex(a,b){
    return{
        re: a.re + b.re,
        im: a.im + b.im
    }
}
function multiplyComplex(a,b){
    return{
        re: (a.re * b.re) - (a.im * b.im),
        im: (a.im * b.re) + (a.re * b.im)
    }
}
function divideComplex(a,b){
    let denominator = (b.re * b.re) + (b.im * b.im);
    return{
        re:((a.re * b.re)+(a.im * b.im))/denominator,
        im:((-a.re * b.im) +(a.im * b.re))/denominator
    }
}

//sets the screen
function setScreen(rZero,iZero,e){
    console.time('drawFractal');
    p = createPolynomial([],rZero,iZero);
    postMessage("Drawing: " + polyToString(p));
    var d = derivitive(p);
    iterations = e.data.maxiterations/2;
    for(let x = 0; x < e.data.id.width; x++){
        for(let y = 0; y < e.data.id.height; y++){
            iterant = complex(e.data.scale * (x - e.data.h), -e.data.scale * (y - e.data.k));
            //iterate newtons method
            let distance = new Array(); 
            for(let i = 0;i < iterations;i++ ){
                iterant = iterate(iterant,p,d);
                iterant = iterate(iterant,p,d);
                for(let i = 0; i < rZero.length; i++){
                    distance[i] = Math.sqrt( ((rZero[i]-iterant.re) * (rZero[i]-iterant.re)) + (iZero[i]-iterant.im) * (iZero[i]-iterant.im));
                }
                for(let i = 0; i < rZero.length; i++){
                    distance[i + rZero.length] = Math.sqrt( ((rZero[i]-iterant.re) * (rZero[i]-iterant.re)) + (-iZero[i]-iterant.im) * (-iZero[i]-iterant.im));
                } 
                if(Math.min(distance) < 0.00001){
                    var shading = i;
                    i = iterations;
                }
            }
            //set the color for the pixel
            const closestRoot = Math.min(distance);
            if(closestRoot < 0.00001 ){
                switch (distance.indexOf(closestRoot)) {
                    case 0:
                        var r = 255 - shading * e.data.shadingCoeficient;
                        var g = shading * e.data.shadingCoeficient;
                        var b = shading * e.data.shadingCoeficient;
                        break;
                    case 1:
                        var r = shading * e.data.shadingCoeficient;
                        var g = 255 - shading * e.data.shadingCoeficient;
                        var b = shading * e.data.shadingCoeficient;
                        break;
                    case 2:
                        var r = shading * e.data.shadingCoeficient;
                        var g = shading * e.data.shadingCoeficient;
                        var b = 255 - shading * e.data.shadingCoeficient;
                        break;
                    case 3:
                        var r = 255 - shading * e.data.shadingCoeficient;
                        var g = 255 - shading * e.data.shadingCoeficient;
                        var b = shading * e.data.shadingCoeficient;
                        break;
                    case 4:
                        var r = shading * e.data.shadingCoeficient;
                        var g = 255 - shading * e.data.shadingCoeficient; 
                        var b = 255 - shading * e.data.shadingCoeficient;
                        break;
                    default:
                        var r = 255 - shading * e.data.shadingCoeficient;
                        var g = 255 - shading * e.data.shadingCoeficient;
                        var b = 255 - shading * e.data.shadingCoeficient;
                }
            }else{
                var r = 0;
                var g = 0;
                var b = 0;
            }

            var offset = (y * e.data.id.width + x) * 4;
            e.data.id.data[offset] = r;
            e.data.id.data[offset + 1] = g;
            e.data.id.data[offset + 2] = b;
            e.data.id.data[offset + 3] = 255;
        }
        postMessage(undefined);
    }
    console.timeEnd('drawFractal');
    postMessage(polyToString(p));
    return e.data.id;
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
    a = setScreen(e.data.rZero,e.data.iZero,e);
    postMessage(a);
    close();
}