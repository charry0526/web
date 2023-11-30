<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="small">


        <el-form-item label="状态" >
          <el-select v-model="form.delFlag" placeholder="状态" >
            <el-option label="启用" value="0"></el-option>
            <el-option label="停止" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="table">
         <div class="table-top-btn">
          <el-row class="text-right">
            <el-button type="text" size="small" @click="addAccount">
              <i class="iconfont icon-add"></i>创建信用金模板
            </el-button>
          </el-row>
        </div>
        <el-table
          v-loading="loading"
          :data="list.list"
          show-summary
          :summary-method="getSummaries"
          style="width: 100%">
           <el-table-column
            width="120px"
            prop="id"
            label="id" v-if="false">
             {{scope.row.id}}
          </el-table-column>
          <el-table-column
            prop="creditScore"
            label="信用评分">
          </el-table-column>
          <el-table-column
            prop="creditLimit"
            label="贷款额度">
          </el-table-column>


          <!-- <el-table-column
            prop="createBy"
            label="创建人">
          </el-table-column> -->

          <el-table-column
            prop="deType"
            label="创建时间">
            <template slot-scope="scope">
            <span>
              {{scope.row.createTime | timeFormat}}
            </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="delFlag"
            label="模板状态">
            <template slot-scope="scope">
              <p>
              <span
                :class="scope.row.delFlag==0?'green':scope.row.delFlag==1?'red':scope.row.delFlag==2?'blue':'yellow'">
                <i v-if="scope.row.delFlag==0" class="iconfont icon-zhengchang"></i>
                <i v-if="scope.row.delFlag==1" class="iconfont icon-dengdai"></i>
                {{scope.row.delFlag==0?'启用':scope.row.delFlag==1?'停止':scope.row.delFlag==2?'启用':'停止'}}
              </span>
              </p>
            </template>
          </el-table-column>


          <el-table-column
            fixed="right"
            prop="isLock"
            width="400px"
            label="操作">
            <template slot-scope="scope">
<!--              <el-button type="success" size="small" :style="{ display: scope.row.delFlag==1?'none':'' }"  @click="toAllocation(scope.row)">一键分配信用金</el-button>-->
              <el-button type="primary" size="small" @click="toChangeUpd(scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="toDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            class="pull-right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="list.pageNum"
            :page-sizes="[10, 20, 50, 100,150,200]"
            :page-size="list.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="list.total">
          </el-pagination>
        </div>
        <ChangeDialog :info='detail' :getDate='getList' ref="changeDialog"></ChangeDialog>
        <AddDialog :getDate='getList' ref="addDialog"></AddDialog>
        <AddDialog :getDate='getList' ref="addAccountDialog"></AddDialog>
        <EditDialog :info='detail' :getDate='getList' ref="UpdDialog"></EditDialog>
      </div>
    </el-card>
  </div>

</template>

<script>
import * as api from '@/axios/api'
import ChangeDialog from './template-dialog'
import AddDialog from './templateAdd-dialog'
import EditDialog from './upd-dialog'

export default {
  components: {
    ChangeDialog,
    AddDialog,
    EditDialog
  },
  props: {},
  data () {
    return {
      isedit: true,
      form: {
        delFlag: '',
        pageNum: 1,
        pageSize: 10
        // phone: ''
      },
      list: {
        list: []
      },
      agentList: [
        {
          'id': 2,
          'agentName': '下级1',
          'agentRealName': '下级1',
          'agentPhone': '18888888888',
          'agentCode': '8888'
        }
      ],
      loading: false, // 表格加载
      detail: null // 选择的订单id
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {
    this.getList()
    this.getAgentList()
  },
  methods: {

    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleSizeChange (val) {
      this.form.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.form.pageNum = val
      this.getList()
    },
    onSubmit () {
      // 查询表格
      this.getList()
    },
    async getAgentList () {
      // 获取下级代理数据
      let opts = {
        pageNum: 1,
        pageSize: 100
      }
      let data = await api.getSecondAgent(opts)
      if (data.status === 0) {
        this.agentList = data.data.list
      } else {
        this.$message.error(data.msg)
      }
    },
    async getList () {
      // 获取表格数据
      let opts = {
        delFlag: this.form.delFlag,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      }
      this.loading = true
      let data = await api.templatetList(opts)
      if (data.status === 0) {
        this.list = data.data
      } else {
        this.$message.error(data.msg)
      }
      this.loading = false
    },
    editStatus (row) {
     // 查看详情
      this.detail = row
      this.$refs.ChangeDialog.dialogVisible = true
    },
    toEditAmtCallback () {
      if (this.isedit) {
        this.$refs.changeDialog.dialogVisible = true
      } else {
        this.$refs.addDialog.dialogVisible = true
      }
    },
     addAccount () {
      // 添加模拟账户
      this.$refs.addAccountDialog.dialogVisible = true
    },
    getSummaries (param) {
      // 底部计算
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        // 第一行 不统计
        if (index === 0) {
          sums[index] = '统计'
          return
        }
        if (column.property === 'creditLimit') {
          // 需要计算列 ==>    userAmt enableAmt  allFreezAmt allProfitAndLose forceLine
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                let num = prev + curr
                return num
              } else {
                return prev
              }
            }, 0)
            sums[index] = sums[index].toFixed(2)
          } else {
            sums[index] = 'N/A'
          }
        }
      })
      return sums
    },
    // 一键分配信用金
    toAllocation(row) {
      this.$confirm('确认一键分配信用金吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await api.templatettAllocation({ cId: row.id })
        if (data.status === 0) {
          this.$message.success(data.msg)
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    },
    async toChangeUpd (row) {
      this.detail = row
      this.$refs.UpdDialog.dialogVisible = true
    },
    // 删除信用金模板
    toDelete (row) {
      this.$confirm('确认删除该信用金模板？此操作不可恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await api.templatetDelete({ cId: row.id })
        if (data.status === 0) {
          this.$message.success(data.msg)
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    }
  }
}
</script>
