import PSO from './pso'
import getHelper from './helper'

export default function (data, MAX_ITER = 1000, BIRDS_NUM = 10) {
  // 第n种疫苗的第k针的最早接种时间 l VACCINE * NUMBER
  const START_TIME = data.l
  // 第n种疫苗的第k针的最晚接种时间 o VACCINE * NUMBER
  const FINAL_TIME = data.o
  // 第n个小孩需要接种第i中疫苗的第k针 w CHILDREN * VACCINE * NUMBER
  const VACCINE_NUMBER = data.w
  // 每个小孩的年纪大小 f CHILDREN
  const CHILDREN_OLD = data.f
  // 已有排期 h DAY
  const SCHEDULING_ARRAY = data.h
  // 速度权重
  const W = 0.8
  // 局部距离权重
  const CI = 2
  // 整体距离权重
  const CII = 2
  const {
    initSpeedFunction,
    initPositionFunction,
    updateSpeedFunction,
    updatePositionFunction,
    fitFunction
  } = getHelper(
    START_TIME,
    FINAL_TIME,
    VACCINE_NUMBER,
    CHILDREN_OLD,
    SCHEDULING_ARRAY,
    W,
    CI,
    CII)
  return new PSO(BIRDS_NUM, MAX_ITER, {
    fitFunction,
    initSpeedFunction,
    initPositionFunction,
    updateSpeedFunction,
    updatePositionFunction
  })
}
