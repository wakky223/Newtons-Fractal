class polynomial{
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
  }
function multiplyPoly(p1,p2){
    let r = [0.0];
    for(i = 0; i < p1.length;i++){
        for(j = 0; j < p2.length; j++){
            r[i+j] = p1[i] * p2[j];
        }
    }
    return r;
}