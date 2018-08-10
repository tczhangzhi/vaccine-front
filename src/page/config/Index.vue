<template>
  <div class="i-config">
    <el-tabs v-model="activeName">
      <el-tab-pane label="遗传算法" name="ga">
        <el-form :model="form">
          <el-form-item label="交叉概率">
            <el-input v-model="form.ga.C" placeholder="请输入交叉概率"></el-input>
          </el-form-item>
          <el-form-item label="变异概率">
            <el-input v-model="form.ga.G" placeholder="请输入变异概率"></el-input>
          </el-form-item>
          <el-form-item label="迭代次数">
            <el-input v-model="form.ga.iter" placeholder="请输入迭代次数"></el-input>
          </el-form-item>
          <el-form-item label="种群规模">
            <el-input v-model="form.ga.num" placeholder="请输入种群规模"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="和声搜索算法" name="hs">
        <el-form :model="form">
          <el-form-item label="创新概率">
            <el-input v-model="form.hs.HMCR" placeholder="请输入创新概率"></el-input>
          </el-form-item>
          <el-form-item label="微调概率">
            <el-input v-model="form.hs.PAR" placeholder="请输入微调概率"></el-input>
          </el-form-item>
          <el-form-item label="微调量">
            <el-input v-model="form.hs.BW" placeholder="请输入微调量"></el-input>
          </el-form-item>
          <el-form-item label="迭代次数">
            <el-input v-model="form.hs.iter" placeholder="请输入迭代次数"></el-input>
          </el-form-item>
          <el-form-item label="种群规模">
            <el-input v-model="form.hs.num" placeholder="请输入种群规模"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="粒子群优化算法" name="pso">
        <el-form :model="form">
          <el-form-item label="加速常数">
            <el-input v-model="form.pso.CI" placeholder="请输入加速常数"></el-input>
          </el-form-item>
          <el-form-item label="加速常数">
            <el-input v-model="form.pso.CII" placeholder="请输入加速常数"></el-input>
          </el-form-item>
          <el-form-item label="惯性因子">
            <el-input v-model="form.pso.W" placeholder="请输入惯性因子"></el-input>
          </el-form-item>
          <el-form-item label="迭代次数">
            <el-input v-model="form.pso.iter" placeholder="请输入迭代次数"></el-input>
          </el-form-item>
          <el-form-item label="种群规模">
            <el-input v-model="form.pso.num" placeholder="请输入种群规模"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<style lang="scss">
.i-config {
}
</style>

<script>
export default {
  name: 'i-config',
  data () {
    return {
      activeName: 'ga',
      form: {
        ga: {
          C: 0.7,
          G: 0.001,
          iter: 1000,
          num: 10
        },
        hs: {
          HMCR: 0.95,
          PAR: 0.3,
          BW: 1,
          iter: 1000,
          num: 10
        },
        pso: {
          CI: 2,
          CII: 2,
          W: 0.8,
          iter: 1000,
          num: 10
        }
      }
    }
  },
  methods: {
    save () {
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
    }
  }
}
</script>
