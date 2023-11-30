<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="small">
        <el-form-item label="用户">
          <el-select filterable v-model="form.userId" placeholder="用户">
            <el-option v-for="i in agentList" :key="i.key" :label="i.nickName" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.auditStatus" placeholder="状态">
<!--            <el-option label="未审核" value="3"></el-option>-->
            <el-option label="审核中" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核不通过" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="success" @click="export2Excel">导出当前页数据</el-button>
        </el-form-item>
      </el-form>
      <div class="table">
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
            width="120px"
            prop="phone"
            label="手机号">
          </el-table-column>

          <el-table-column
            width="100"
            prop="userName"
            label="用户名/id">
            <template slot-scope="scope">
              <p>
                {{scope.row.userName}}
                <span class="small">
                {{scope.row.userId}}
              </span>
              </p>
            </template>
          </el-table-column>

<!--          <el-table-column-->
<!--            width="120px"-->
<!--            prop="creditScore"-->
<!--            label="信用评分">-->
<!--            <template slot-scope="scope">-->
<!--            <span>-->
<!--              {{scope.row.creditScore}}-->
<!--            </span>-->
<!--            </template>-->
<!--          </el-table-column>-->

<!--          <el-table-column-->
<!--            prop="creditLimit"-->
<!--            label="贷款限额">-->
<!--          </el-table-column>-->
           <el-table-column
            prop="amountBorrowed"
            label="已借贷额">
          </el-table-column>
<!--           <el-table-column-->
<!--            prop="residualCredit"-->
<!--            label="剩余贷额">-->
<!--          </el-table-column>-->
          <el-table-column
            prop="amountCreditApplied"
            label="该次申请贷额">
          </el-table-column>

          <el-table-column
            prop="deType"
            width="180"
            label="申请贷款时间">
            <template slot-scope="scope">
            <span>
              {{scope.row.amountCreditAppliedTime | timeFormat}}
            </span>
            </template>
          </el-table-column>

          <el-table-column
            width="120"
            prop="auditStatus"
            label="审核状态">
            <template slot-scope="scope">
              <p>
              <span
                :class="scope.row.auditStatus==1?'green':scope.row.auditStatus==2?'red':scope.row.auditStatus==0?'blue':'yellow'">
                <i v-if="scope.row.auditStatus==1" class="iconfont icon-zhengchang"></i>
                <i v-if="scope.row.auditStatus==2" class="iconfont icon-failure"></i>
                <i v-if="scope.row.auditStatus==3" class="iconfont icon-failure"></i>
                <i v-if="scope.row.auditStatus==0" class="iconfont icon-dengdai"></i>
                {{scope.row.auditStatus==1?'审核通过':scope.row.auditStatus==2?'审核不通过':scope.row.auditStatus==0?'审核中':'未审核'}}
              </span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            prop="deType"
            width="180"
            label="审核时间">
            <template slot-scope="scope">
            <span>
              {{scope.row.auditTime | timeFormat}}
            </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="deType"
            width="180"
            label="创建时间">
            <template slot-scope="scope">
            <span>
              {{scope.row.createTime | timeFormat}}
            </span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="isLock"
            width="200px"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small"  v-if="scope.row.auditStatus == 0" @click="toChangeAudit(scope.row)">审核</el-button>
              <!-- <el-button type="primary" size="small"  v-if="scope.row.auditStatus == 3" @click="toChangeAudit(scope.row)">审核</el-button> -->
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
        <AuditDialog :info='detail' :getDate='getList' ref="auditDialog"></AuditDialog>
      </div>
    </el-card>
  </div>

</template>

<script>
import * as api from '@/axios/api'
import ChangeDialog from './credit-dialog'
import AuditDialog from './audit-dialog'

export default {
  components: {
    ChangeDialog,
    AuditDialog
  },
  props: {},
  data () {
    return {
      isedit: true,
      form: {
        userId: '',
        phone: '',
        auditStatus: '',
        amountCreditAppliedTime: '',
        pageNum: 1,
        pageSize: 10
      },
      list: {
        list: []
      },
      agentList: [
        {
          'id': 2,
          'agentName': '下级1',
          'nickName': '下级1',
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
    export2Excel () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../../assets/js/Export2Excel')
        const tHeader = ['手机号', '用户名', '信用评分', '贷款限额', '已借贷款', '剩余贷款', '该次申请贷款', '申请贷款时间', '审核状态', '审核时间', '创建时间']
        // 上面设置Excel的表格第一行的标题
        const filterVal = ['phone', 'userName', 'creditScore', 'creditLimit', 'amountBorrowed', 'residualCredit', 'amountCreditApplied', 'amountCreditAppliedTime', 'auditStatus', 'auditTime', 'createTime']
        // 上面的index、phone_Num、school_Name是tableData里对象的属性
        const list = this.list.list // 把data里的tableData存到list
        const data = this.formatJson(filterVal, list)
        let nowdate = new Date()
        let year = nowdate.getFullYear()
        let month = nowdate.getMonth() + 1
        let day = nowdate.getDay()
        export_json_to_excel(tHeader, data, '信用金列表' + year + month + day)
      })
    },
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
      let data = await api.getUserListPull(opts)
      if (data.status === 0) {
        this.agentList = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    async getList () {
      // 获取表格数据
      let opts = {
        phone: this.form.phone,
        payChannel: this.form.payChannel,
        userName: this.form.userName,
        creditScore: this.form.creditScore,
        creditLimit: this.form.creditLimit,
        residualCredit: this.form.residualCredit,
        amountCreditApplied: this.form.amountCreditApplied,
        userId: this.form.userId,
        auditStatus: this.form.auditStatus,
        auditTime: this.form.auditTime,
        createTime: this.form.createTime,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      }
      this.loading = true
      let data = await api.creaditList(opts)
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
     async toChangeAudit (row) {
      this.detail = row
      this.$refs.auditDialog.dialogVisible = true
    },
    toEditAmtCallback () {
      if (this.isedit) {
        this.$refs.changeDialog.dialogVisible = true
      } else {
        this.$refs.addDialog.dialogVisible = true
      }
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
        if (column.property === 'amountBorrowed') {
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
    // 删除信用金
    toDelete (row) {
      this.$confirm('确认删除该信用金？此操作不可恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await api.creaditDelete({ cId: row.id })
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
