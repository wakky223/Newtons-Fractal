class polynomial{
    constructor(zerosRe,zerosIm) {
        if(zerosX.length != zerosY.length){
            throw 'Coordinate Pair Exception.';
            break;
        }

        for(let i = 0; i < zerosX.length; i++){


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
    for(i = 0; i < p1.length;i++){
        for(j = 0; j < p2.length; j++){
            
        }
    }
}