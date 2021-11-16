/*class polynomial{
    constructor(zerosRe,zerosIm) {
        if(zerosRe.length != zerosIm.length){
            throw 'Coordinate Pair Exception.';
        }
        for(let i = 0; i < zerosRe.length; i++){


        }
      this.degree = parseInt(window.prompt("Degree: "));
      this.cf = [];
      console.log("Number of coeficients: " + this.cf.length)
      this.cf.length = this.degree;
      this.cf.length += 1;
      console.log("Number of coeficients: " + this.cf.length)
      console.log("Degree: " + this.degree)
      this.cf[0] = parseFloat(window.prompt("constant:"));
      for (let i = 1; i < this.cf.length; i++) {
          this.cf[i] = parseFloat(window.prompt("coefficient " + i + " (starting at the x term):"));
      }
      }
      eval(input) {
      let k = this.cf[0];
          for (let i = 1; i < this.degree + 1; i++) {
              k += this.cf[i] * (input**i);
          }
      return k;
    }
  }*/

//multiplies two polynoials, inputs are arrays starting at the x^0 term. 
function multiplyPoly(p1,p2){
    let r = new Array(p1.length + p2.length - 1).fill(0);
    for(let i = 0; i < p1.length;i++){
        for(j = 0; j < p2.length; j++){
            r[i+j] += p1[i] * p2[j];
        }
    }
    return r;
}

//calculates the polynomial that has given complex conjugate zeros
function imaginaryPolynomialZeros(realPart, imaginaryPart) {
    r = [0, 0, 1];
    r[0] = (realPart * realPart) + (imaginaryPart * imaginaryPart);
    r[1] = -2 * realPart;
    console.log("x^2 + " + r[1] + "x + " + r[0]);
    return r;
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
        for (i = 0; i < zeros.length; i++) {
            r = multiplyPoly(r, [-zeros[i], 1]);
        }
        for (i = 1; i < czerosRP.length; i++) {
            r = multiplyPoly(r, imaginaryPolynomialZeros(czerosRP[i], czerosIP[i]));
        }
    }
    console.log(r[0] + ' + ' + r[1] + 'x + ' + r[2] + 'x^2 + ' + r[3] + 'x^3 + ' + r[4] + 'x^4 + ' + r[5] + 'x^5 + ' + r[6] + 'x^6 + ' + r[7] + 'x^7 + ')
    return r;
}


c = document.getElementById("canvas");
ctx = c.getContext("2d");

