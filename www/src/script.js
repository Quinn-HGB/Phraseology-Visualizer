function u(n){
  var sum = 0;
  for(var i=0;i<=10;i++){
    sum+=Math.pow(n,i)*Math.pow(-1,i);
  }
  return sum;
}
function main(){
  for(var i=1;i<=10;i++){
    console.log(u(i));
  }
}
main();