function bubbleSort(data,eval1){
  var array = Array.from(data);
  for (var i = 0; i < array.length - 1; i++) {
    for (var j = 0; j < array.length - 1; j++) {
      if (eval1(array[j],array[j+1])) {
        //swap!
        var temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}

export function tieredSort(data,filters){
  var output = bubbleSort(data,function(fst,snd){
    for(var i = 0; i < filters.length;i++){
      if(snd[filters[i]] < fst[filters[i]]){
        return true;
      }
      else if(snd[filters[i]] === fst[filters[i]]){
        continue;
      }
      else{
        break;
      }
    }
    return false;
  });
  return output;
}

var array = [{x:1,y:2},{x:1,y:3},{x:4,y:1},{x:2,y:2},{x:3,y:3},{x:2,y:1}];


var sorted = tieredSort(array,["y","x"]);
// bubbleSort(array,function(fst,snd){
//   if(snd.y<fst.y){
//     return true;
//   }
//   else if(snd == fst){
//     if(snd.x < fst.x){
//       return true;
//     }
//   }
//   return false;
// });

// console.log(sorted);

var sorted2 = bubbleSort(sorted,function(fst,snd){
  if(snd['x']<fst['x']){
    return true;
  }
  else if(snd == fst){
    if(snd["y"] < fst["y"]){
      return true;
    }
  }
  return false;
});

// console.log(sorted2);
