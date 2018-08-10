const { cloneDeep } = require('lodash')

class Music {
  constructor (musicNotes, fit) {
    this.musicNotes = musicNotes
    this.fit = fit
  }
}

export default class HS {
  constructor (musicNum, threshold, helperFunctions) {
    this.musicNum = musicNum
    this.threshold = threshold
    this.initMusicNotesFunction = helperFunctions.initMusicNotesFunction
    this.fitFunction = helperFunctions.fitFunction
    this.improviseMusicFunction = helperFunctions.improviseMusicFunction
    const musics = this.initMusics()
    const [ best, worst ] = this.getBestWorst(musics)
    this.musics = musics
    this.best = best
    this.worst = worst
  }
  improviseMusic () {
    const { best, worst } = this
    return this.improviseMusicFunction(best, worst)
  }
  getBestWorst (musics) {
    const musicNum = this.musicNum
    let best = musics[0]
    let min = musics[0].fit
    let worst = musics[0]
    let max = musics[0].fit
    for (let index = 1; index < musicNum; index++) {
      if (min > musics[index].fit) {
        best = cloneDeep(musics[index])
        min = musics[index].fit
      }
      if (max < musics[index].fit) {
        worst = cloneDeep(musics[index])
        max = musics[index].fit
      }
    }
    return [ best, worst ]
  }
  initMusics () {
    const musicNum = this.musicNum
    const musics = []
    for (let index = 0; index < musicNum; index++) {
      const music = new Music()
      music.musicNotes = this.initMusicNotesFunction()
      music.fit = this.fitFunction(music.musicNotes)
      musics.push(music)
    }
    return musics
  }
  updateMusics () {
    const musicNum = this.musicNum
    const musics = this.musics
    let maxIndex = 0
    let max = musics[maxIndex].fit
    for (let index = 1; index < musicNum; index++) {
      if (max < musics[index].fit) {
        maxIndex = index
        max = musics[index].fit
      }
    }
    const newMusic = this.improviseMusic()
    if (newMusic.fit < max) {
      musics[maxIndex] = newMusic
    }
  }
  solve () {
    for (let index = 0; index < this.threshold; index++) {
      this.updateMusics()
      for (const music of this.musics) {
        if (music.fit < this.best.fit) {
          this.best = music
        }
      }
      if (index % 100 === 0) {
        console.log(`第${index}步: 最优解为${this.best.fit}`)
      }
    }
  }
  next (callback) {
    this.updateMusics()
    for (const music of this.musics) {
      if (music.fit < this.best.fit) {
        this.best = music
      }
    }
    callback && callback(this.best.fit)
  }
  getSolution () {
    return this.best.musicNotes
  }
}
