<template>
  <div ref="chart" :style="style" class="i-bar"></div>
</template>

<style>
.i-bar {
  height: 200px;
}
</style>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mounted () {
    this.setStyle()
    this.$nextTick(() => {
      this.init()
      this.setOption(this.option)
    })
  },
  destroyed () {
    window.onresize = this.onresizeListener
  },
  data () {
    return {
      onresizeListener: null,
      chart: null,
      style: {
        width: 0
      }
    }
  },
  computed: {
    option () {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function (params) {
            return `第${params[0].axisValueLabel}天:<br/>${params[0].marker}${params[0].data}人接种`
          }
        },
        xAxis: {
          type: 'category',
          data: this.range(1, this.data.length - 1, 1)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: this.data.slice(1, this.data.length),
          type: 'bar'
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
      this.onresizeListener = window.onresize
      window.onresize = () => {
        this.onresizeListener()
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
    }
  },
  watch: {
    option: {
      handler: 'onOptionChange',
      deep: true
    }
  }
}
</script>
