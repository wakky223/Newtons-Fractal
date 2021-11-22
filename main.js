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
    } else if (czerosRp.length > 0) {
        r[0] = imaginaryPolynomialZeros(czerosRP[0], czerosIP[0])[0];
        r[1] = imaginaryPolynomialZeros(czerosRP[0], czerosIP[0])[1];
        r[2] = 1;
        for (let i = 0; i < zeros.length; i++) {
            r = multiplyPoly(r, [-zeros[i], 1]);
        }
        for (let i = 1; i < czerosRP.length; i++) {
            r = multiplyPoly(r, imaginaryPolynomialZeros(czerosRP[i], czerosIP[i]));
        }
    }
    console.log(r[0] + ' + ' + r[1] + 'x + ' + r[2] + 'x^2 + ' + r[3] + 'x^3 + ' + r[4] + 'x^4 + ' + r[5] + 'x^5 + ' + r[6] + 'x^6 + ' + r[7] + 'x^7 + ');
    return r;
}

//takes the derivitave of a given polynomial
function derivitive(p){
    let r = new Array(p.length - 1).fill(0); 
    for (let i = 0; i < p.length-1; i++) {
        r[i] = p[i+1]*(i+1);
    }
    console.log(r[0] + ' + ' + r[1] + 'x + ' + r[2] + 'x^2 + ' + r[3] + 'x^3 + ' + r[4] + 'x^4 + ' + r[5] + 'x^5 + ' + r[6] + 'x^6 + ' + r[7] + 'x^7 + ');
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

//sets a pixel to a color
function setPixel(color,posx,posy){
    ctx.fillStyle = color;
    ctx.fillRect(posx, posy, 1, 1);
}


var c = document.getElementById("canvas");
ctx = c.getContext("2d");

p = createPolynomial([1,2,3,4,5],[4,9],[13,5]);
let str = "";
for(let i = p.length; i > 0; i--){
    str += p[i] + "x^" + i + " + ";
}
document.write(str);