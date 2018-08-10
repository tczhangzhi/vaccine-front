<template>
  <div class="i-algorithm">
    <div ref="chart" :style="style" class="algorithm__chart"></div>
    <el-row class="algorithm__control">
      <el-button type="primary" @click="startInterval">本地运算</el-button>
      <el-button type="primary" @click="startMockInterval">服务端运算(暂不支持)</el-button>
      <el-button @click="clearInterval">结束计算</el-button>
      <el-button @click="clearData">重新计算</el-button>
      <el-button @click="showResult">查看结果</el-button>
    </el-row>
    <div>
      <i-bar v-if="isShowResult" :data="showResultData"></i-bar>
    </div>
  </div>
</template>

<style lang="scss">
.i-algorithm {
  .algorithm__chart {
    height: 600px;
  }
  .algorithm__control {
    padding-top: 20px;
    text-align: center;
  }
}
</style>

<script>
import { $page } from '@helper'
import IBar from './Bar'
import getPSO from '@helper/lib/pso'
import getHS from '@helper/lib/hs'
import getGA from '@helper/lib/ga'

const GA = 0
const HS = 1
const PSO = 2

export default {
  name: 'i-algorithm',
  mounted () {
    this.setStyle()
    this.$nextTick(() => {
      this.init()
      this.setOption(this.option)
    })
  },
  destroyed () {
    window.onresize = null
  },
  data () {
    return {
      isShowResult: false,
      showResultData: [],
      pso: null,
      hs: null,
      ga: null,
      interval: null,
      chart: null,
      style: {
        width: 0
      },
      option: {
        legend: {
          data: ['遗传算法', '和声搜索算法', '粒子群优化算法']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        dataZoom: {
          show: true,
          start: 0,
          end: 100
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.range(100, 1000, 100)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '遗传算法',
          type: 'line',
          smooth: true,
          lineStyle: {
            opacity: 0.4
          },
          data: []
        }, {
          name: '和声搜索算法',
          type: 'line',
          smooth: true,
          lineStyle: {
            opacity: 0.8
          },
          data: []
        }, {
          name: '粒子群优化算法',
          type: 'line',
          smooth: true,
          lineStyle: {
            opacity: 0.8
          },
          data: []
        }]
      }
    }
  },
  methods: {
    init () {
      this.chart = this.$echarts.init(this.$refs.chart)
    },
    setOption (option) {
      this.chart && this.chart.setOption(option)
    },
    onOptionChange (val, old) {
      this.setOption(val)
    },
    setStyle () {
      const width = `${this.$refs.chart.parentNode.offsetWidth}px`
      this.style = {
        width
      }
      window.onresize = () => {
        const width = `${this.$refs.chart.parentNode.offsetWidth}px`
        this.style = {
          width
        }
        this.$nextTick(() => {
          this.chart.resize()
        })
      }
    },
    range (start, end, step) {
      const len = (end - start) / step
      if (!(len % 1 === 0)) {
        throw new Error('Error:Range can\'t be divided by step with no remainder!')
      }
      return [...Array(len + 1)].map((e, index) => start + index * step)
    },
    getPSOResult (result) {
      const data = this.option.series[PSO].data
      data.push(result)
      const xAxis = this.option.xAxis.data
      if (data.length > xAxis.length) {
        xAxis.push(xAxis[xAxis.length - 1] + 100)
      }
    },
    getGAResult (result) {
      const data = this.option.series[GA].data
      const xAxis = this.option.xAxis.data
      data.push(result)
      if (data.length > xAxis.length) {
        xAxis.push(xAxis[xAxis.length - 1] + 100)
      }
    },
    getHSResult (result) {
      const data = this.option.series[HS].data
      const xAxis = this.option.xAxis.data
      data.push(result)
      if (data.length > xAxis.length) {
        xAxis.push(xAxis[xAxis.length - 1] + 100)
      }
    },
    mockPSO (max, min) {
      const data = this.option.series[PSO].data
      if (!data.length) {
        return max
      }
      const last = data[data.length - 1]
      const r = Math.random()
      if (r < 0.55 || last - 1 <= min) {
        return last
      }
      return last - 1
    },
    mockHS (max, min) {
      const data = this.option.series[HS].data
      if (!data.length) {
        return max
      }
      const last = data[data.length - 1]
      const r = Math.random()
      if (r < 0.65 || last - 1 <= min) {
        return last
      }
      return last - 1
    },
    mockGA (max, min) {
      const data = this.option.series[GA].data
      if (!data.length) {
        return max
      }
      const last = data[data.length - 1]
      const r = Math.random()
      if (r < 0.7 || last - 1 <= min) {
        return last
      }
      return last - 1
    },
    startInterval () {
      if (!this.pso || !this.hs || !this.ga) {
        $page.child.data({ days: 40 }).then((data) => {
          this.pso = getPSO(data)
          this.hs = getHS(data)
          this.ga = getGA(data)
        })
      }
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.pso.next((fit) => {
          this.getPSOResult(fit)
        })
        this.showResultData = this.ga.getResult()
        this.hs.next((fit) => {
          this.getHSResult(fit)
        })
        this.ga.next((fit) => {
          this.getGAResult(fit)
        })
      }, 3000)
    },
    startMockInterval () {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.getPSOResult(this.mockPSO(54, 20))
        this.getHSResult(this.mockHS(50, 20))
        this.getGAResult(this.mockGA(47, 20))
      }, 1000)
    },
    clearInterval () {
      clearInterval(this.interval)
    },
    clearData () {
      this.option.series[PSO].data = []
      this.option.series[HS].data = []
      this.option.series[GA].data = []
      this.option.xAxis.data = this.range(100, 1000, 100)
    },
    showResult () {
      this.isShowResult = !this.isShowResult
    }
  },
  watch: {
    option: {
      handler: 'onOptionChange',
      deep: true
    }
  },
  components: {
    IBar
  }
}
</script>
