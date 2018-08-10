const { random, floor } = Math
const { zeros, matrix, size } = require('mathjs')

export default function (
  START_TIME,
  FINAL_TIME,
  VACCINE_NUMBER,
  CHILDREN_OLD,
  SCHEDULING_ARRAY,
  W,
  CI,
  CII) {
  // 矫正形状
  const [VACCINE_1, NUMBER_1] = size(START_TIME)
  const [VACCINE_2, NUMBER_2] = size(FINAL_TIME)
  const [CHILDREN_1, VACCINE_3, NUMBER_3] = size(VACCINE_NUMBER)
  const [CHILDREN_2] = size(CHILDREN_OLD)
  const [DAY_1] = size(SCHEDULING_ARRAY)

  if (VACCINE_1 !== VACCINE_2 || VACCINE_2 !== VACCINE_3 || NUMBER_1 !== NUMBER_2 || NUMBER_2 !== NUMBER_3 || CHILDREN_1 !== CHILDREN_2) {
    throw new Error('矩阵形状错误!')
  }
  // 儿童数量 n
  const CHILDREN = CHILDREN_1
  // 疫苗种类数量 N
  const VACCINE = VACCINE_1
  // 疫苗接种次数
  const NUMBER = NUMBER_1
  // 排期天数
  const DAY = DAY_1

  const randomDay = (start, end) => {
    return start + floor(random() * (end - start + 1))
  }

  return {
    initSpeedFunction () {
      return zeros(CHILDREN, VACCINE, NUMBER).toArray()
    },
    updateSpeedFunction (bird, psoBestBird) {
      const speedArray = zeros(CHILDREN, VACCINE, NUMBER).toArray()
      for (let childrenIndex = 0; childrenIndex < CHILDREN; childrenIndex++) {
        for (let vaccineIndex = 0; vaccineIndex < VACCINE; vaccineIndex++) {
          for (let numberIndex = 0; numberIndex < NUMBER; numberIndex++) {
            if (VACCINE_NUMBER[childrenIndex][vaccineIndex][numberIndex]) {
              const childOld = CHILDREN_OLD[childrenIndex]
              const finalTime = FINAL_TIME[vaccineIndex][numberIndex]
              const startTime = START_TIME[vaccineIndex][numberIndex]
              if (childOld <= finalTime && childOld >= startTime) {
                const birdlastBestPosition = bird.lastBestPosition[childrenIndex][vaccineIndex][numberIndex]
                const psoBestPosition = psoBestBird.position[childrenIndex][vaccineIndex][numberIndex]
                const birdPosition = bird.position[childrenIndex][vaccineIndex][numberIndex]
                const speed = W * bird.speed + CI * random() * (birdlastBestPosition - birdPosition) + CII * random() * (psoBestPosition - birdPosition)
                speedArray[childrenIndex][vaccineIndex][numberIndex] = speed
              }
            }
          }
        }
      }
      return speedArray
    },
    initPositionFunction () {
      const positionArray = zeros(CHILDREN, VACCINE, NUMBER).toArray()
      for (let childrenIndex = 0; childrenIndex < CHILDREN; childrenIndex++) {
        for (let vaccineIndex = 0; vaccineIndex < VACCINE; vaccineIndex++) {
          for (let numberIndex = 0; numberIndex < NUMBER; numberIndex++) {
            if (VACCINE_NUMBER[childrenIndex][vaccineIndex][numberIndex]) {
              const childOld = CHILDREN_OLD[childrenIndex]
              const finalTime = FINAL_TIME[vaccineIndex][numberIndex]
              const startTime = START_TIME[vaccineIndex][numberIndex]
              if (childOld <= finalTime && childOld >= startTime) {
                const day = randomDay(childOld, finalTime)
                positionArray[childrenIndex][vaccineIndex][numberIndex] = day
              }
            }
          }
        }
      }
      return positionArray
    },
    updatePositionFunction (position, speedArray) {
      const positionArray = matrix(position).clone().toArray()
      for (let childrenIndex = 0; childrenIndex < CHILDREN; childrenIndex++) {
        for (let vaccineIndex = 0; vaccineIndex < VACCINE; vaccineIndex++) {
          for (let numberIndex = 0; numberIndex < NUMBER; numberIndex++) {
            if (VACCINE_NUMBER[childrenIndex][vaccineIndex][numberIndex]) {
              const childOld = CHILDREN_OLD[childrenIndex]
              const finalTime = FINAL_TIME[vaccineIndex][numberIndex]
              const startTime = START_TIME[vaccineIndex][numberIndex]
              if (childOld <= finalTime && childOld >= startTime) {
                const speed = speedArray[childrenIndex][vaccineIndex][numberIndex]
                const day = position[childrenIndex][vaccineIndex][numberIndex]
                if (day + speed <= finalTime && day + speed >= startTime) {
                  positionArray[childrenIndex][vaccineIndex][numberIndex] = day + speed
                }
              }
            }
          }
        }
      }
      return positionArray
    },
    fitFunction (position) {
      const scheduling = matrix(SCHEDULING_ARRAY).clone().toArray()
      for (let childrenIndex = 0; childrenIndex < CHILDREN; childrenIndex++) {
        for (let vaccineIndex = 0; vaccineIndex < VACCINE; vaccineIndex++) {
          for (let numberIndex = 0; numberIndex < NUMBER; numberIndex++) {
            const day = position[childrenIndex][vaccineIndex][numberIndex]
            if (day < scheduling.length) {
              scheduling[day]++
            }
          }
        }
      }
      let max = 0
      for (let index = 1; index < DAY; index++) {
        if (scheduling[index] > max) {
          max = scheduling[index]
        }
      }
      return max
    }
  }
}
