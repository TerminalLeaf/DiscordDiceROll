Array.prototype.myJoin = function(seperator,start,end){
    if(!start) start = 0;
    if(!end) end = this.length - 1;
    end++;
    return this.slice(start,end).join(seperator);
};

function isInteger(value) {
  return /^\d+$/.test(value);
}

function countOccurences(string, word) {
   return string.split(word).length - 1;
}

function getOccurrence(array, value) {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] != value) {
      count++;
    }
  }
  return count;
}

function stringIncludes(text, term) {
  return text.includes(term);
}

function modRand(text) {
  //random mod
  let numModRandom = countOccurences(text, "r")-1; //check if any + modifiers //2
  let tempNum = []; //[]
  let tempAmnt = [];
  let tempNum2 = [];
  let tempAmnt2 = [];
  let posIndex = [];
  let negIndex = [];
  let h = [];
  let hh = [];
  let h2 = []; //list of all rolled values
  let hh2 = [];
  let g = [];
  let g2 = []; //temp value
  let y; //final mod for random
  let j = text; //input text (message)
  let a = j.indexOf('r');
  let b = j.indexOf('d');
  let totalAmnt;
  let sameType;

  let i = 0;

  while (i < numModRandom){
    console.log(numModRandom);
    let z, z2, y, y2;

    if (i == 0){
      z2 = z = a+1;
      y2 = y = b+1;
    } else {
      z = posIndex[i-1]+1;
      z2 = negIndex[i-1]+1;
      y = g[i-1]+1;
      y2 = g2[i-1]+1;
    }

    if (stringIncludes(j.substr((j.indexOf("r", z)-2), (j.indexOf("r", z))), "+")) {
      let x = [j.indexOf("r", z)];
      posIndex = posIndex.concat(x);
      let v = [j.indexOf("d", y)];
      g = g.concat(v);
    } else {
      posIndex = posIndex.concat(false);
      g = g.concat(false);
    }

    if (stringIncludes(j.substr((j.indexOf("r", z2)-2), (j.indexOf("r", z2))), "-")) {
      let x = [j.indexOf("r", z2)];
      negIndex = negIndex.concat(x);
      let v = [j.indexOf("d", y2)];
      g2 = g2.concat(v);
    } else {
      negIndex = negIndex.concat(false);
      g2 = g2.concat(false);
    }

    i++;
  }

  for (let i = 0; i<posIndex.length; i++){
    if (posIndex[i] != false && g[i] != false){
      let stringSlice = j.slice(g[i]+1);
      let slicePoint;
      if (stringSlice.indexOf("+") > stringSlice.indexOf("-")){
        slicePoint = stringSlice.indexOf("-");
      } else {
        slicePoint = stringSlice.indexOf("+");
      }

      if (slicePoint != -1) {
        stringSlice = j.substr(g[i]+1, slicePoint);
      }

      //instead of this, look for nearest NaN (most likely a pos/neg sign)
      tempAmnt[i] = parseInt(stringSlice);
      tempNum[i] = j.substr(posIndex[i]+1, g[i]).split('d')[0];
    } else {
      tempAmnt[i] = false;
      tempNum[i] = false;
    }
  }

  for (let i = 0; i<negIndex.length; i++){
    if (negIndex[i] != false && g2[i] != false){
      let stringSlice = j.slice(g2[i]+1);
      let slicePoint;
      if (stringSlice.indexOf("+") > stringSlice.indexOf("-")){
        slicePoint = stringSlice.indexOf("-");
      } else {
        slicePoint = stringSlice.indexOf("+");
      }
      if (slicePoint != -1) {
        stringSlice = j.substr(g2[i]+1, slicePoint);
      }

      //instead of this, look for nearest NaN (most likely a pos/neg sign)
      tempAmnt2[i] = parseInt(stringSlice);
      tempNum2[i] = j.substr(negIndex[i]+1, g2[i]).split('d')[0];
    } else {
      tempAmnt2[i] = false;
      tempNum2[i] = false;
    }
  }


  //find each num and amnt, and roll for data


  let p = 0;


  while (p<getOccurrence(posIndex, false)){
    if (posIndex[p] != false) {
      let nums = 0;
      let kk = 0;
      while (kk < tempNum[p]) {
        nums += rollAnyDice(tempAmnt[kk]);
        kk++;
      }

      h[p] = nums;
    } else if (posIndex[p] == false) {
      h[p] = 0;
    }
    p++;
  }
  h.forEach(element => {
    element = parseInt(element);
  });

  let p2 = 0;
  while (p2<getOccurrence(negIndex, false)){
    if (negIndex[p2] != false) {
      let nums = 0;
      let kk = 0;
      while (kk < tempNum2[p2]) {
        nums -= rollAnyDice(tempAmnt2[kk]);
        kk++;
      }

      hh[p2] = nums;
    } else if (negIndex[p2] == false) {
      hh[p2] = 0;
    }
    p2++;
  }
  console.log(hh);

  let sums = 0;
  for (let i = 0; i < h.length; i++) {
    sums += h[i];
  }

  let sums2 = 0;
  for (let i = 0; i < hh.length; i++) {
    sums2 += hh[i];
  }

  console.log(sums + "sums");
  console.log(sums2 + "sums2");
  sums = sums+sums2;
  return sums;
}

function diceCheckNumAndAmnt2(text) {
  //normal roll + mod
  let a, b; //check num and amnt for normal roll
  let c = []; //check if + mod if not false, then yes and will contain index value, if false then no
  let d = []; //check if - mod if not false, then yes and will contain index value, if false then no
  let numModPos = countOccurences(text, "+"); //check if any + modifiers
  let numModNeg = countOccurences(text, "-"); //check if any + modifiers
  let j = text; //input text (message)
  let num, amnt;
  let mod = 0; //return values, don't change until final
  let numModRandom = countOccurences(text, "r")-1; //check if any + modifiers

  //check if it's roll dice command, if not exit
  if (!stringIncludes(j, "r") && !stringIncludes(j, "d")) return undefined;

  //find normal roll value locations (a is amount of dice, b is type of dice)
  a = j.indexOf('r');
  b = j.indexOf("d");

  //check if amount of + signs is larger than zero
  if (numModPos > 0){
    //fill up c array with list of index of different plus signs
    for (let i = 0; i < numModPos; i++) {
      //[6, 8]
      if (i == 0) {
        c = [j.indexOf("+")];
      } else {
        let z = c[i-1];
        let y = [j.indexOf("+", z+1)];
        c = c.concat(y);
      }
    }
  //if no plus signs
} else if (numModPos == 0) {
    c = false;
  }

  //check if amount of - signs is larger than zero
  if (numModNeg > 0){
    //fill up c array with list of index of different minus signs
    for (let i = 0; i < numModNeg; i++) {
      if (i == 0) {
        d = [j.indexOf("-")];
      } else {
        let z = d[i-1];
        let y = j.indexOf("-", z+1)
        d = d.concat(y);
      }
    }
  //if no minus signs
  } else if (numModNeg == 0) {
    d = false;
  }

  //find num value behind first r to access number of dice
  num = parseInt(j.substring(a+1, b));

  if (numModRandom == 0){
    //check if plus/minus sign exist or no
    if (c == false && d != false){
      //case 1: plus sign no exist, minus sign exist
      amnt = parseInt(j.substring(b+1, d[0]));
      //amount is starting from first b to first minus sign

      mod = 0;
      let k = 0;
      let l = 0;
      for (let i = 0; i < d.length; i++) {
        //[6]
        k = d[i]; //6
        l = d[i+1]; //undefined
        if (l == undefined) {
          mod -=parseInt(j.substring(k+1));
        } else {
          mod -= parseInt(j.substring(k+1, l));
        }
      }

    } else if (c != false && d != false){
      if (c[0] < d[0]){
        amnt = parseInt(j.substring(b+1, c[0]));
      } else {
        amnt = parseInt(j.substring(b+1, d[0]));
      }
      let temp1 = 0;
      let k = 0;
      let l = 0;
      for (let i = 0; i < c.length; i++) {

        k = c[i];
        l = c[i+1];
        if (l == undefined) {
          temp1 += parseInt(j.substring(k+1));
        } else {
          temp1 += parseInt(j.substring(k+1, l));
        }

      }

      let temp2 = 0;
      let k2 = 0;
      let l2 = 0;
      for (let i = 0; i < d.length; i++) {
        k2 = d[i];
        l2 = d[i+1];
        if (l2 == undefined) {
          temp2 -=parseInt(j.substring(k2+1));
        } else {
          temp2 -= parseInt(j.substring(k2+1, l2));
        }
      }
      mod = temp1+temp2;

    } else if (c != false && d == false){
      amnt = parseInt(j.substring(b+1, c[0]));

      let k = 0;
      let l = 0;
      let i = 0;
      while (i < c.length) {
        k = c[i];
        l = c[i+1];
        if (l == undefined) {
          mod += parseInt(j.substring(k+1));
        } else {
          mod += parseInt(j.substring(k+1, l));
        }
        i++;
      }
    } else if (c == false && d == false){
      amnt = parseInt(j.substring(b+1, j.length));
      mod = 0;
    }
  } else {
    if (c == false && d != false){
      //case 1: plus sign no exist, minus sign exist
      amnt = parseInt(j.substring(b+1, d[0]));
      //amount is starting from first b to first minus sign
      mod = 0;
      let k = 0;
      let l = 0;
      for (let i = 0; i < d.length; i++) {
        k = d[i];
        l = d[i+1];
        if (l == undefined) {
          mod -=parseInt(j.substring(k+1));
        } else {
          mod -= parseInt(j.substring(k+1, l));
        }
      }

      if (isNaN(mod)) {
        mod = modRand(j);
      }

    } else if (c != false && d != false){

      if (c[0] < d[0]){
        amnt = parseInt(j.substring(b+1, c[0]));
      } else {
        amnt = parseInt(j.substring(b+1, d[0]));
      }
      let temp1 = 0;
      let k = 0;
      let l = 0;
      for (let i = 0; i < c.length; i++) {

        k = c[i];
        l = c[i+1];
        if (l == undefined) {
          temp1 += parseInt(j.substring(k+1));
        } else {
          temp1 += parseInt(j.substring(k+1, l));
        }

      }

      let temp2 = 0;
      let k2 = 0;
      let l2 = 0;
      for (let i = 0; i < d.length; i++) {
        k2 = d[i];
        l2 = d[i+1];
        if (l2 == undefined) {
          temp2 -=parseInt(j.substring(k2+1));
        } else {
          temp2 -= parseInt(j.substring(k2+1, l2));
        }
      }


      mod = temp1+temp2;

    } else if (c != false && d == false){
      amnt = parseInt(j.substring(b+1, c[0]));

      let k = 0;
      let l = 0;
      let i = 0;
      while (i < c.length) {
        k = c[i];
        l = c[i+1];
        if (l == undefined) {
          mod += parseInt(j.substring(k+1));
        } else {
          mod += parseInt(j.substring(k+1, l));
        }
        i++;
      }
    } else if (c == false && d == false){
    amnt = parseInt(j.substring(b+1, j.length));
    mod = 0;
    }
  }

  if (isNaN(mod)) {
    mod = modRand(j);
  } else {
    mod = mod;
  }

  num = parseInt(num);
  amnt = parseInt(amnt);
  mod = parseInt(mod);
  if (num != undefined && amnt != undefined && (mod != undefined || !isNaN(mod))) return [num, amnt, mod];
}

function rollAnyDice(num) {
  if (num > 0) return Math.floor(Math.random()*(num)+1);
}

function rollAnyNumOfDice(msg) {
  let temp = diceCheckNumAndAmnt2(msg);
  let thing = temp[0];
  let di = temp[1];
  let mod = temp[2]
  let a = [];
  let val = [];
  if (thing > 125) {

    a = "nvm, i'd like to not die, thank you very much...";
  } else if (thing < 1) {
    a = "nvm, bruh you idiot, stop trying to roll a dice that doesn't exist"
  } else if (di < 1) {
    a = "nvm, stop trying to roll a dice into the zeroth dimension"
  } else if (!isInteger(thing) || !isInteger(di)) {
    a = "nvm, stop trying to break the bot"
  } else if (isNaN(mod)) {
    a = "you forgot an m, lol"
  } else {
    while (thing > 0) {
      a.push(rollAnyDice(di));
      thing--;
      if (thing == 0) break;
    }
    let modVal;

    if (mod >= 0) {
      modVal = " + ";
    } else {
      modVal = " - ";
    }

    let i = a.length;
    while (i>0) {
      h = ["\n| " + a[i-1], Math.abs(mod)];
      h = h.join(modVal);
      a[i-1] = [h, a[i-1] + mod + " |"];
      a[i-1] = a[i-1].join(" = ");
      i--;
      if (i == 0) break;
    }
  }

  a = a.toString();
  let middle, before, after;
  let orange = 0;
  if (a.length > 1024){
    while (a.length > 1024) {
      middle = Math.floor(a.length / 2);
      middle = a.indexOf("|", middle);
      val[orange] = a.substr(0, middle);
      val[orange+1] = a.substr(middle + 1);

      if (val[orange].length < 1024) break;
      h=h+2;
    }
  } else {
    val = a;
  }

  return val;
}



module.exports = {rollAnyDice, rollAnyNumOfDice, diceCheckNumAndAmnt2};
