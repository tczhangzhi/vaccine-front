import HS from './hs'
import getHelper from './helper'

export default function (data, MAX_ITER = 1000, MUSIC_NUM = 10) {
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
  const HMCR = 0.95
  // 新和声来源于微调后的和声库的概率
  const PAR = 0.3
  const {
    initMusicNotesFunction,
    fitFunction,
    improviseMusicFunction
  } = getHelper(
    START_TIME,
    FINAL_TIME,
    VACCINE_NUMBER,
    CHILDREN_OLD,
    SCHEDULING_ARRAY,
    HMCR,
    PAR)
  return new HS(MUSIC_NUM, MAX_ITER, {
    initMusicNotesFunction,
    fitFunction,
    improviseMusicFunction
  })
}
