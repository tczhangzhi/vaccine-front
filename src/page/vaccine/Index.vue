<template>
  <div class="i-vaccine">
    <el-row>
      <el-form inline>
        <el-form-item label="疫苗总次数:">
          <el-input v-model="query.times" placeholder="请输入疫苗总次数"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchClick">查询</el-button>
          <el-button @click="handleCreateClick">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="疫苗总次数" prop="times"></el-table-column>
        <el-table-column label="操作" width="125">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEditClick(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDeleteClick(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="i-vaccine__pageination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
    <el-dialog
      title="新增"
      :visible.sync="showCreate">
      <el-form :model="create" :rules="createRule" ref="create" inline>
        <el-row
          v-for="(config, index) in create.scheduling"
          :key="index"
          :label="`第${index + 1}次`">
          <el-form-item>
            <el-input v-model.number="config.start" placeholder="请输入最早接种时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number="config.end" placeholder="请输入最晚接种时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number="config.space" placeholder="请输入与下一针间隔"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleDeleteCreateClick(index)">删除</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-button type="primary" @click="handleCreateCreateClick">新增</el-button>
        <el-button type="primary" @click="handleSaveCreateClick">保存</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      title="修改"
      :visible.sync="showEdit">
       <el-form :model="edit" :rules="editRule" ref="edit" inline>
        <el-row
          v-for="(config, index) in edit.scheduling"
          :key="index"
          :label="`第${index + 1}次`">
          <el-form-item>
            <el-input v-model.number="config.start" placeholder="请输入最早接种时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number="config.end" placeholder="请输入最晚接种时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number="config.space" placeholder="请输入与下一针间隔"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleDeleteEditClick(index)">删除</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-button type="primary" @click="handleCreateEditClick">新增</el-button>
        <el-button type="primary" @click="handleSaveEditClick">保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.i-vaccine {
  .i-vaccine__pageination {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<script>
import { $page } from '@helper'

export default {
  name: 'i-vaccine',
  mounted () {
    this.fetch()
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      query: {
        times: ''
      },
      showCreate: false,
      showEdit: false,
      create: this.init(),
      edit: this.init(),
      createRule: {
        scheduling: [
          {
            type: 'array',
            trigger: 'blur',
            fields: {
              start: {
                type: 'number',
                required: true,
                message: '请输入最早接种时间'
              },
              end: {
                type: 'number',
                required: true,
                message: '请输入最晚接种时间'
              },
              space: {
                type: 'number',
                required: true,
                message: '请输入与下一针间隔'
              }
            }
          }
        ]
      },
      editRule: {
        scheduling: [
          {
            type: 'array',
            trigger: 'blur',
            fields: {
              start: {
                type: 'number',
                required: true,
                message: '请输入最早接种时间'
              },
              end: {
                type: 'number',
                required: true,
                message: '请输入最晚接种时间'
              },
              space: {
                type: 'number',
                required: true,
                message: '请输入与下一针间隔'
              }
            }
          }
        ]
      },
      tableData: []
    }
  },
  methods: {
    fetch () {
      const { pageIndex, pageSize, query } = this
      $page.config.index({
        pageIndex,
        pageSize,
        ...query
      }).then(res => {
        this.tableData = res.list
        this.total = res.total
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    handleSearchClick () {
      this.fetch()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.fetch()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.fetch()
    },
    handleDeleteClick (row) {
      $page.config.destroy(row).then(res => {
        this.fetch()
        this.$message({
          message: '删除成功!',
          type: 'success'
        })
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    init () {
      return {
        scheduling: [{
          start: '',
          end: '',
          space: ''
        }]
      }
    },
    handleCreateClick () {
      this.showCreate = true
      this.create = this.init()
    },
    handleEditClick (row) {
      this.showEdit = true
      this.edit = this.init()
      $page.config.show(row).then(res => {
        this.edit = {
          ...res,
          scheduling: res.scheduling
        }
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    handleSaveEditClick () {
      this.$refs['edit'].validate((valid) => {
        if (valid) {
          $page.config.update(this.edit).then(res => {
            this.showEdit = false
            this.edit = this.init()
            this.fetch()
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
          }).catch(err => {
            this.$message({
              message: err,
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    handleSaveCreateClick () {
      this.$refs['create'].validate((valid) => {
        if (valid) {
          $page.config.create(this.create).then(res => {
            this.showCreate = false
            this.create = this.init()
            this.fetch()
            this.$message({
              message: '新增成功!',
              type: 'success'
            })
          }).catch(err => {
            this.$message({
              message: err,
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    handleDeleteCreateClick (index) {
      this.create.scheduling.splice(index, 1)
    },
    handleDeleteEditClick (index) {
      this.edit.scheduling.splice(index, 1)
    },
    handleCreateCreateClick () {
      this.create.scheduling.push({
        start: '',
        end: '',
        space: ''
      })
    },
    handleCreateEditClick () {
      this.edit.scheduling.push({
        start: '',
        end: '',
        space: ''
      })
    }
  }
}
</script>
