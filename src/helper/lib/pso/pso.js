class Bird {
  constructor (speed, position, fit, lastBestPosition, lastBestFit) {
    this.speed = speed
    this.position = position
    this.fit = fit
    this.lastBestFit = lastBestFit
    this.lastBestPosition = lastBestPosition
  }
}

export default class PSO {
  constructor (birdNum, threshold, helperFunctions) {
    this.fitFunction = helperFunctions.fitFunction
    this.initSpeedFunction = helperFunctions.initSpeedFunction
    this.initPositionFunction = helperFunctions.initPositionFunction
    this.updateSpeedFunction = helperFunctions.updateSpeedFunction
    this.updatePositionFunction = helperFunctions.updatePositionFunction
    this.birdNum = birdNum
    this.threshold = threshold
    const [birds, best] = this.initBirds(birdNum)
    this.birds = birds
    this.best = best
  }
  initBirds (birdNum, solutionSpace) {
    const birds = []
    let index = 0
    for (index; index < birdNum; index++) {
      const position = this.initPositionFunction()
      const speed = this.initSpeedFunction()
      const fit = this.fitFunction(position)
      birds.push(new Bird(speed, position, fit, position, fit))
    }
    let best = birds[0]
    for (const bird of birds) {
      if (bird.fit < best.fit) {
        best = bird
      }
    }
    return [birds, best]
  }
  updateBirds () {
    for (const bird of this.birds) {
      bird.speed = this.updateSpeedFunction(bird, this.best)
      bird.position = this.updatePositionFunction(bird.position, bird.speed)
      bird.fit = this.fitFunction(bird.position)
      if (bird.fit < bird.lastBestFit) {
        bird.lastBestFit = bird.fit
        bird.lastBestPosition = bird.position
      }
    }
  }
  solve (callback) {
    let index = 0
    for (index; index < this.threshold; index++) {
      this.updateBirds()
      for (const bird of this.birds) {
        if (bird.fit < this.best.fit) {
          this.best = bird
        }
      }
      callback && callback(index, this.best.fit)
    }
  }
  next (callback) {
    this.updateBirds()
    for (const bird of this.birds) {
      if (bird.fit < this.best.fit) {
        this.best = bird
      }
    }
    callback && callback(this.best.fit)
  }
  getSolution () {
    return this.best.position
  }
}
