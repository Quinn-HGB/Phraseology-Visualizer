

module.exports = class Cycle {
  constructor(cycle) {
      this.name = cycle[0]
      this.date = new Date(cycle[1] + "T" + cycle[2] + ":00") 
      this.read =     cycle[3] 
      this.norm =     cycle[4]
      this.correct =  cycle[5]
      this.suspense = cycle[6]
      this.easy =     cycle[7]
      this.med =      cycle[8]
      this.com =      cycle[9]
  }
}


