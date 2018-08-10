<template>
  <div class="i-inoculation">
    <el-row>
      <el-form inline>
        <el-form-item label="最早接种时间:">
          <el-input v-model.number="query.start" placeholder="请输入最早接种时间"></el-input>
        </el-form-item>
        <el-form-item label="最晚接种时间:">
          <el-input v-model.number="query.end" placeholder="请输入最晚接种时间"></el-input>
        </el-form-item>
        <el-form-item label="疫苗种类:">
          <el-input v-model.number="query.configId" placeholder="请输入疫苗种类"></el-input>
        </el-form-item>
        <el-form-item label="儿童编号:">
          <el-input v-model.number="query.childId" placeholder="请输入疫苗种类"></el-input>
        </el-form-item>
        <el-form-item label="儿童姓名:">
          <el-input v-model="query.childName" placeholder="请输入儿童姓名"></el-input>
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
        <el-table-column label="最早接种时间" prop="start"></el-table-column>
        <el-table-column label="最晚接种时间" prop="end"></el-table-column>
        <el-table-column label="疫苗种类" prop="configId"></el-table-column>
        <el-table-column label="儿童姓名" prop="name"></el-table-column>
        <el-table-column label="操作" width="125">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEditClick(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDeleteClick(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="i-inoculation__pageination">
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
        <el-form-item label="最早接种时间:">
          <el-input disabled v-model.number="create.start" placeholder="请输入最早接种时间"></el-input>
        </el-form-item>
        <el-form-item label="最晚接种时间:">
          <el-input disabled v-model.number="create.end" placeholder="请输入最晚接种时间"></el-input>
        </el-form-item>
        <el-form-item label="疫苗种类:">
          <el-select
            v-model.number="create.configId"
            placeholder="请输入疫苗种类"
            filterable
            remote
            :remote-method="fetchConfigList"
            @change="handleConfigIdChange(create.configId)"
            style="width: 100%">
            <el-option
              v-for="item in configList"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接种阶段:">
          <el-select
            v-model.number="create.times"
            @change="handleTimesCreateChange(create.times)"
            placeholder="请选择接种阶段"
            style="width: 100%">
            <el-option
              v-for="item in Object.keys(timesList)"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="儿童姓名及编号:">
          <el-select
            v-model.number="create.childId"
            placeholder="请输入儿童姓名"
            filterable
            remote
            :remote-method="fetchChildList"
            style="width: 100%">
            <el-option
              v-for="item in childList"
              :key="item.id"
              :label="`${item.name}-${item.id}`"
              :value="item.id"
            ></el-option>
          </el-select>
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
        <el-form-item label="最早接种时间:">
          <el-input disabled v-model.number="edit.start" placeholder="请输入最早接种时间"></el-input>
        </el-form-item>
        <el-form-item label="最晚接种时间:">
          <el-input disabled v-model.number="edit.end" placeholder="请输入最晚接种时间"></el-input>
        </el-form-item>
        <el-form-item label="疫苗种类:">
          <el-select
            v-model.number="edit.configId"
            placeholder="请输入疫苗种类"
            filterable
            remote
            :remote-method="fetchConfigList"
            @change="handleConfigIdChange(edit.configId)"
            style="width: 100%">
            <el-option
              v-for="item in configList"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接种阶段:">
          <el-select
            v-model.number="edit.times"
            @change="handleTimesEditChange(edit.times)"
            placeholder="请选择接种阶段"
            style="width: 100%">
            <el-option
              v-for="item in Object.keys(timesList)"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="儿童姓名及编号:">
          <el-select
            v-model.number="edit.childId"
            placeholder="请输入儿童姓名"
            filterable
            remote
            :remote-method="fetchChildList"
            style="width: 100%">
            <el-option
              v-for="item in childList"
              :key="item.id"
              :label="`${item.name}-${item.id}`"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveEditClick">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.i-inoculation {
  .i-inoculation__pageination {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<script>
import { $page } from '@helper'

export default {
  name: 'i-inoculation',
  mounted () {
    this.fetch()
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      query: {
        start: '',
        end: '',
        configId: '',
        childId: '',
        childName: ''
      },
      showCreate: false,
      showEdit: false,
      create: this.init(),
      edit: this.init(),
      createRule: {
        start: [
          { required: true, message: '请输入最早接种时间', trigger: 'blur' }
        ],
        end: [
          { required: true, message: '请输入最晚接种时间', trigger: 'blur' }
        ],
        configId: [
          { required: true, message: '请输入疫苗种类', trigger: 'blur' }
        ],
        childId: [
          { required: true, message: '请输入儿童姓名', trigger: 'blur' }
        ]
      },
      editRule: {
        start: [
          { required: true, message: '请输入最早接种时间', trigger: 'blur' }
        ],
        end: [
          { required: true, message: '请输入最晚接种时间', trigger: 'blur' }
        ],
        configId: [
          { required: true, message: '请输入疫苗种类', trigger: 'blur' }
        ],
        childId: [
          { required: true, message: '请输入儿童姓名', trigger: 'blur' }
        ]
      },
      tableData: [],
      childList: [],
      configList: [],
      timesList: []
    }
  },
  methods: {
    fetch () {
      const { pageIndex, pageSize, query } = this
      $page.vaccine.index({
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
      $page.vaccine.destroy(row).then(res => {
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
        start: 0,
        end: 0,
        configId: 0,
        times: 0,
        childId: ''
      }
    },
    handleCreateClick () {
      this.showCreate = true
      this.create = this.init()
    },
    handleEditClick (row) {
      this.showEdit = true
      this.edit = this.init()
      $page.vaccine.show(row).then(res => {
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
          const { times, ...data } = this.edit
          $page.vaccine.update(data).then(res => {
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
          const { times, ...data } = this.create
          $page.vaccine.create(data).then(res => {
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
    fetchChildList (name) {
      $page.child.list({ name }).then(res => {
        this.childList = res
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    fetchConfigList (id) {
      $page.config.list({ id }).then(res => {
        this.configList = res
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    handleConfigIdChange (id) {
      if (!id || this.configList.length === 0) {
        return
      }
      this.timesList = this.configList.find(item => item.id === id).scheduling
    },
    handleTimesEditChange (index) {
      if (this.timesList.length === 0) {
        return
      }
      this.edit.start = this.timesList[index].start
      this.edit.end = this.timesList[index].end
    },
    handleTimesCreateChange (index) {
      if (this.timesList.length === 0) {
        return
      }
      this.create.start = this.timesList[index].start
      this.create.end = this.timesList[index].end
    }
  }
}
</script>
