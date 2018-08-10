const { cloneDeep } = require('lodash')
const { random } = Math

class Individual {
  constructor (chromosome, fit) {
    this.chromosome = chromosome
    this.fit = fit
  }
}

export default class GA {
  constructor (individualNum, threshold, helperFunctions, {
    C,
    G
  }) {
    this.individualNum = individualNum
    this.threshold = threshold
    this.initIndividualChromosomeFunction = helperFunctions.initIndividualChromosomeFunction
    this.fitFunction = helperFunctions.fitFunction
    this.crossIndividualChromosomeFunction = helperFunctions.crossIndividualChromosomeFunction
    this.getScheduling = helperFunctions.getScheduling
    this.C = C
    this.G = G
    const [individuals, best] = this.initIndividuals()
    this.individuals = individuals
    this.best = best
  }
  initIndividuals () {
    const individualNum = this.individualNum
    const individuals = []
    for (let index = 0; index < individualNum; index++) {
      const individual = new Individual()
      individual.chromosome = this.initIndividualChromosomeFunction()
      individual.fit = this.fitFunction(individual.chromosome)
      individuals.push(individual)
    }
    let best = individuals[0]
    for (const individual of individuals) {
      if (individual.fit < best.fit) {
        best = individual
      }
    }
    return [individuals, best]
  }
  selectIndividual () {
    const individuals = this.individuals
    const individualNum = individuals.length
    let F = 0
    // 累计适应值总合
    for (let i = 0; i < individualNum; i++) {
      F += individuals[i].fit
    }
    const p = []
    for (let i = 0; i < individualNum; i++) {
      // 计算累计概率
      p[i] = individuals[i].fit / F
      if (i !== 0) {
        p[i] = p[i - 1] + p[i]
      }
    }
    let survivalNum = individualNum
    const shouldIndividualNum = this.individualNum
    while (survivalNum > shouldIndividualNum) {
      const r = random()
      for (let i = 0; i < individuals.length; i++) {
        if (r >= p[i]) {
          survivalNum--
          p.splice(i, 1)
          individuals.splice(i, 1)
          break
        }
      }
    }
  }
  crossIndividual () {
    const individuals = this.individuals
    const individualNum = individuals.length
    for (let i = 0; i < individualNum; i++) {
      if (random() < this.C) {
        const father = cloneDeep(individuals[i])
        const mother = cloneDeep(individuals[(i + 1) % individualNum])
        const individual = new Individual()
        individual.chromosome = this.crossIndividualChromosomeFunction(father.chromosome, mother.chromosome)
        individual.fit = this.fitFunction(individual.chromosome)
        individuals.push(individual)
      }
    }
  }
  mutationIndividual () {
    const individuals = this.individuals
    const individualNum = individuals.length
    for (let i = 1; i < individualNum; i++) {
      if (random() < this.G) {
        const individual = new Individual()
        individual.chromosome = this.initIndividualChromosomeFunction()
        individual.fit = this.fitFunction(individual.chromosome)
        individuals.splice(i, 1, individual)
      }
    }
  }
  solve (callback) {
    for (let index = 0; index < this.threshold; index++) {
      this.selectIndividual()
      this.crossIndividual()
      this.mutationIndividual()
      for (const individual of this.individuals) {
        if (individual.fit < this.best.fit) {
          this.best = cloneDeep(individual)
        }
      }
      callback && callback(index, this.best.fit)
    }
  }
  next (callback) {
    this.selectIndividual()
    this.crossIndividual()
    this.mutationIndividual()
    for (const individual of this.individuals) {
      if (individual.fit < this.best.fit) {
        this.best = cloneDeep(individual)
      }
    }
    callback && callback(this.best.fit)
  }
  getSolution () {
    return this.best.chromosome
  }
  getResult () {
    return this.getScheduling(this.best.chromosome)
  }
}
