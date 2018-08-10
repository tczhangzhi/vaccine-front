<template>
  <div class="i-child">
    <el-row>
      <el-form inline>
        <el-form-item label="姓名:">
          <el-input v-model="query.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄:">
          <el-input v-model="query.days" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchClick">查询</el-button>
          <el-button @click="handleCreateClick">新增</el-button>
          <el-button @click="handleCreateRandomClick">随机一个</el-button>
          <el-button @click="handleCreateInitClick">初始化一个</el-button>
          <el-button @click="handleCreateDataClick">下载数据</el-button>
          <el-button type="danger" @click="handleCleanClick">清空数据库</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="年龄" prop="days"></el-table-column>
        <el-table-column label="操作" width="125">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEditClick(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDeleteClick(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="i-child__pageination">
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
      <el-form :model="create" :rules="createRule" ref="create">
        <el-form-item label="姓名:">
          <el-input v-model="create.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄:">
          <el-input v-model.number="create.days" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveCreateClick">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改"
      :visible.sync="showEdit">
       <el-form :model="edit" :rules="editRule" ref="edit">
        <el-form-item label="编号:">
          <el-input v-model="edit.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="edit.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄:">
          <el-input v-model.number="edit.days" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveEditClick">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.i-child {
  .i-child__pageination {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<script>
import { $page } from '@helper'

export default {
  name: 'i-child',
  mounted () {
    this.fetch()
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      query: {
        name: '',
        days: ''
      },
      showCreate: false,
      showEdit: false,
      create: this.init(),
      edit: this.init(),
      createRule: {
        days: [
          { type: 'number', message: '年龄应当为数字', trigger: 'blur' }
        ]
      },
      editRule: {
        days: [
          { type: 'number', message: '年龄应当为数字', trigger: 'blur' },
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      tableData: []
    }
  },
  methods: {
    fetch () {
      const { pageIndex, pageSize, query } = this
      $page.child.index({
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
    handleCreateDataClick () {
      $page.child.download({ days: 40 }).then(res => {
        this.$message({
          message: '下载成功!',
          type: 'success'
        })
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
      $page.child.destroy(row).then(res => {
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
        id: '',
        name: '',
        days: 0
      }
    },
    handleCreateClick () {
      this.showCreate = true
      this.create = this.init()
    },
    handleEditClick (row) {
      this.showEdit = true
      this.edit = this.init()
      $page.child.show(row).then(res => {
        this.edit = res
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
          $page.child.update(this.edit).then(res => {
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
          $page.child.create(this.create).then(res => {
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
    handleCreateRandomClick () {
      this.$prompt('请输入随机数量：', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: '随机数量不正确！'
      }).then(({ value }) => {
        $page.child.random({
          n: value
        }).then(res => {
          this.fetch()
        }).catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您取消了生成!'
        })
      })
    },
    handleCreateInitClick () {
      $page.child.init().then(res => {
        this.fetch()
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    handleCleanClick () {
      $page.child.clean().then(res => {
        this.fetch()
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    }
  }
}
</script>
