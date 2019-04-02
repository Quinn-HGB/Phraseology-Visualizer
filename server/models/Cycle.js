

module.exports = class Cycle {
  constructor(cycle) {
      this.name = cycle[0]
      this.date = this.dayMonth(cycle);
      this.time = this.unix(cycle);
      this.read =     Number(cycle[3]) 
      this.norm =     Number(cycle[4])
      this.correct =  Number(cycle[5])
      this.suspense = Number(cycle[6])
      this.easy =     Number(cycle[7])
      this.med =      Number(cycle[8])
      this.com =      Number(cycle[9])
      this.easyTime = Number(cycle[10])
  }
  
  dayMonth(cycle){
    var date = new Date(cycle[1] + "T" + "12:00:00");
    return date;
  }
  unix(cycle){
    var date = new Date(cycle[1] + "T" +cycle[2]+ ":00");
    return date.getTime()
  }
}


