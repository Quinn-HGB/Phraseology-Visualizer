class DayAverage{
  constructor(cycles) {
    this.date = new Date(cycles[0].date);
    this.time = this.date.getTime();
    this.read = Math.round(cycles.map(cycle => cycle.read).reduce(getSum)/cycles.length*100)/100;
    this.norm = Math.round(cycles.map(cycle => cycle.norm).reduce(getSum)/cycles.length*100)/100;
    this.correct = Math.round(cycles.map(cycle => cycle.correct).reduce(getSum)/cycles.length*100)/100;
    this.suspense = Math.round(cycles.map(cycle => cycle.suspense).reduce(getSum)/cycles.length*100)/100;
    this.easy = Math.round(cycles.map(cycle => cycle.easy).reduce(getSum)/cycles.length*100)/100;
    this.med = Math.round(cycles.map(cycle => cycle.med).reduce(getSum)/cycles.length*100)/100;
    this.com = Math.round(cycles.map(cycle => cycle.com).reduce(getSum)/cycles.length*100)/100;
    this.easyTime = Math.round(cycles.map(cycle => cycle.easyTime).reduce(getSum)/cycles.length*100)/100;
    this.medTime = Math.round(cycles.map(cycle => cycle.medTime).reduce(getSum)/cycles.length*100)/100;
    this.comTime = Math.round(cycles.map(cycle => cycle.comTime).reduce(getSum)/cycles.length*100)/100;
    this.easyCorrect = Math.round(cycles.map(cycle => cycle.easyCorrect).reduce(getSum)/cycles.length*100)/100;
    this.medCorrect = Math.round(cycles.map(cycle => cycle.medCorrect).reduce(getSum)/cycles.length*100)/100;
    this.comCorrect = Math.round(cycles.map(cycle => cycle.comCorrect).reduce(getSum)/cycles.length*100)/100;
    this.correctRate = Math.round(this.correct/this.norm*10000)/100;
    this.easyPercentage = Math.round(this.easy/this.norm*10000)/100;
    this.medPercentage = Math.round(this.med/this.norm*10000)/100;
    this.comPercentage = Math.round(this.com/this.norm*10000)/100;
  }
}


class Day {
  constructor(cycles) {
    this.date = new Date(cycles[0].date);
    this.time = this.date.getTime();
    this.read = cycles.map(cycle => cycle.read).reduce(getSum);
    this.norm = cycles.map(cycle => cycle.norm).reduce(getSum);
    this.correct = cycles.map(cycle => cycle.correct).reduce(getSum);
    this.suspense = cycles.map(cycle => cycle.suspense).reduce(getSum);
    this.easy = cycles.map(cycle => cycle.easy).reduce(getSum);
    this.med = cycles.map(cycle => cycle.med).reduce(getSum);
    this.com = cycles.map(cycle => cycle.com).reduce(getSum);
    this.easyTime = cycles.map(cycle => cycle.easyTime).reduce(getSum);
    this.medTime = cycles.map(cycle => cycle.medTime).reduce(getSum);
    this.comTime = cycles.map(cycle => cycle.comTime).reduce(getSum);
    this.easyCorrect = cycles.map(cycle => cycle.easyCorrect).reduce(getSum);
    this.medCorrect = cycles.map(cycle => cycle.medCorrect).reduce(getSum);
    this.comCorrect = cycles.map(cycle => cycle.comCorrect).reduce(getSum);
    this.correctRate = Math.round(this.correct/this.norm*10000)/100;
    this.easyPercentage = Math.round(this.easy/this.norm*10000)/100;
    this.medPercentage = Math.round(this.med/this.norm*10000)/100;
    this.comPercentage = Math.round(this.com/this.norm*10000)/100;
  }
}

function getSum(total, num) {
  return total + num;
}