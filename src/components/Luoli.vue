<template>
  <div class="i-luoli" ref="luoli" id="luoli" @click="onClick" v-drag="onDrag">
    <img :src="src" draggable="false" class="luoli__img">
    <div class="luoli__message" v-if="message">
      {{message}}
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import defaultImg from '@assets/images/default.gif'
import clickImg from '@assets/images/click.png'
import moveImg from '@assets/images/move.png'
import randomImg from '@assets/images/random.png'

export default {
  props: {
    isMessageIn: {
      type: Boolean,
      default: true
    },
    quiet: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    document.body.appendChild(this.$refs.luoli)
    this.onresizeListener = window.onresize
    window.onresize = () => {
      this.onresizeListener && this.onresizeListener()
      this.getRange()
    }
    this.getSize()
    this.getRange()
    if (!this.quiet) {
      this.sayHello()
      this.sayRandom()
      this.animateRandom()
    }
  },
  destroyed () {
    this.clean()
  },
  data () {
    return {
      onresizeListener: null,
      actions: {
        default: defaultImg,
        click: clickImg,
        move: moveImg,
        random: randomImg
      },
      messageTime: 1000,
      timeouts: [],
      intervals: [],
      action: 'default',
      message: '',
      clickTime: 0,
      size: {
        width: 0,
        height: 0
      },
      range: {
        width: 0,
        height: 0
      },
      draging: 0
    }
  },
  computed: {
    src () {
      return this.actions[this.action]
    }
  },
  methods: {
    setTimeout (callback, time) {
      const id = setTimeout(callback, time)
      this.timeouts.push(id)
    },
    setInterval (callback, time) {
      const id = setInterval(callback, time)
      this.intervals.push(id)
    },
    getRange () {
      this.range = {
        width: window.innerWidth - this.size.width,
        height: window.innerHeight - this.size.height
      }
    },
    getSize () {
      this.size = {
        width: this.$refs.luoli.offsetWidth,
        height: this.$refs.luoli.offsetHeight
      }
    },
    showMessage (msg, messageTime) {
      if (!this.isMessageIn) {
        this.$emit('message', msg)
        return
      }
      this.message = msg
      this.timer = this.setTimeout(() => {
        this.message = ''
      }, messageTime || this.messageTime)
    },
    changeAction (action, time) {
      this.action = action
      if (!time) {
        return
      }
      this.setTimeout(() => {
        this.action = 'default'
      }, time)
    },
    changeBackAction () {
      this.action = 'default'
    },
    getMessageFromRandom (messages) {
      const index = Math.floor(Math.random() * messages.length)
      return messages[index]
    },
    getPositionFromRandom () {
      const randoms = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.75]
      var x = Math.floor(Math.random() * randoms.length)
      var y = Math.floor(Math.random() * randoms.length)
      return {
        left: this.range.width / 2 * (1 + randoms[x]),
        top: this.range.height / 2 * (1 + randoms[y])
      }
    },
    sayHello () {
      const now = (new Date()).getHours()
      let message = ''
      if (now > 0 && now <= 6) {
        message = ' 你是夜猫子呀？还不睡觉，明天起的来么你？'
      } else if (now > 6 && now <= 11) {
        message = ' 早上好，早起的鸟儿有虫吃噢！早起的虫儿被鸟吃，你是鸟儿还是虫儿？嘻嘻！'
      } else if (now > 11 && now <= 14) {
        message = ' 中午了，吃饭了么？不要饿着了，饿死了谁来挺我呀！'
      } else if (now > 14 && now <= 18) {
        message = ' 中午的时光真难熬！还好有你在！'
      } else {
        message = ' 快来逗我玩吧！'
      }
      const position = this.getPositionFromRandom()
      $('#luoli').animate(
        position,
        {
          duration: 2000,
          complete: this.showMessage(message)
        })
    },
    sayRandom () {
      this.setInterval(() => {
        const messages = ['陪我聊天吧！', '好无聊哦，你都不陪我玩！', '…@……!………', '^%#&*!@*(&#)(!)(', '我可爱吧！嘻嘻!~^_^!~~', '谁淫荡呀?~谁淫荡?，你淫荡呀!~~你淫荡！~~', '主任，现在数据库连接状态不稳定哦~']
        const message = this.getMessageFromRandom(messages)
        this.showMessage(message)
        this.changeAction('click', 1000)
      }, 35000)
    },
    animateRandom () {
      this.setInterval(() => {
        const messages = ['主人，你的算法跑完了！', '主人，内存超出警戒值了哦！', '主人，没事别怕~我就叫一下~', '主人，你的算法异常终止了哦~']
        const message = this.getMessageFromRandom(messages)
        const position = this.getPositionFromRandom()
        this.changeAction('random', 2000)
        $('#luoli').animate(
          position,
          {
            duration: 2000,
            complete: this.showMessage(message)
          })
      }, 45000)
    },
    onClick () {
      if (this.draging) {
        return
      }
      this.clickTime++
      let messages = []
      if (this.clickTime > 5) {
        messages = ['你有完没完呀？', `你已经摸我${this.clickTime}次了`, '非礼呀！救命！OH，My ladygaga']
      } else {
        messages = ['筋斗云！~我飞！', '我跑呀跑呀跑！~~', '别摸我，大男人，有什么好摸的！', '惹不起你，我还躲不起你么？', '不要摸我了，我会告诉老婆来打你的！', '干嘛动我呀！小心我咬你！']
      }
      const message = this.getMessageFromRandom(messages)
      const position = this.getPositionFromRandom()
      this.changeAction('click', 2000)
      $('#luoli').animate(
        position,
        {
          duration: 2000,
          complete: this.showMessage(message)
        })
    },
    onDrag (v) {
      if (v === 1) {
        this.changeAction('move')
      } else if (v === 2) {
        this.changeBackAction()
      }
      this.draging = v
    },
    clean () {
      const luoli = document.getElementById('luoli')
      luoli.onmousedown = null
      luoli.parentNode.removeChild(luoli)
      window.onresize = this.onresizeListener
      this.timeouts.forEach(id => {
        clearTimeout(id)
      })
      this.intervals.forEach(id => {
        clearInterval(id)
      })
    }
  },
  directives: {
    drag: {
      bind (el, binding) {
        const element = el
        element.onmousedown = function (e) {
          const disX = e.clientX - element.offsetLeft
          const disY = e.clientY - element.offsetTop
          binding.value(0)
          document.onmousemove = function (e) {
            binding.value(1)
            const l = e.clientX - disX
            const t = e.clientY - disY
            element.style.left = `${l}px`
            element.style.top = `${t}px`
            document.onmouseup = function (e) {
              document.onmousemove = null
              document.onmouseup = null
              binding.value(2)
            }
          }
          document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
            binding.value(0)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.i-luoli {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 999;
  .luoli__img {
    transform:scaleX(-1)
  }
  .luoli__message {
    position: absolute;
    padding: 0 10px;
    max-width: 200px;
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #fafafa;
    border-radius: 4px;
  }
}
</style>
