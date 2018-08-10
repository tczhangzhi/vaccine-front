<template>
<div class="i-frame">
  <el-container>
    <el-header class="header">
      <span>疫苗接种仿真平台</span>
    </el-header>
    <el-container>
      <el-aside class="aside">
        <el-menu
          background-color="#262d37"
          text-color="#bfcbd9"
          active-text-color="#20a0ff"
          router>
          <el-menu-item index="child">
            <template slot="title">
              <i class="el-icon-star-off"></i>
              <span>儿童管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="inoculation">
            <template slot="title">
              <i class="el-icon-date"></i>
              <span>接种管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="vaccine">
            <template slot="title">
              <i class="el-icon-news"></i>
              <span>疫苗管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="config">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>设置管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="algorithm">
            <template slot="title">
              <i class="el-icon-view"></i>
              <span>算法可视化</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
    <i-luoli :quiet="false"></i-luoli>
  </el-container>
</div>
</template>

<style lang="scss">
.i-frame {
  height: 100%;
  overflow: hidden;
  .el-container,
  .el-aside {
    height: 100%;
  }
  .header {
    background: #2196f3;
    line-height: 60px;
    height: 60px;
    color: #fff;
  }
  .aside {
    width: 240px !important;
    flex: none;
    background-color: #262d37;
    border-right: solid 1px #e6e6e6;
    .el-menu {
      background: inherit;
      border-right: none;
    }
  }
  .main {
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>

<script>
import ILuoli from '@components/luoli'

export default {
  name: 'Frame',
  components: {
    ILuoli
  }
}
</script>
