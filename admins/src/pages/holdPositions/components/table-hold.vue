<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline" size="small">
      <el-form-item label="类型">
        <el-select filterable v-model="form.positionType" placeholder="持仓单">
          <el-option label="全部" value=""></el-option>
          <el-option label="正式持仓" value="0"></el-option>
          <el-option label="模拟持仓" value="1"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="持仓状态">
          <el-select filterable v-model="form.state" placeholder="持仓单">
          <el-option label="全部" value=""></el-option>
          <el-option label="持仓" value="0"></el-option>
          <el-option label="平仓" value="1"></el-option>
          </el-select>
      </el-form-item> -->
      <el-form-item label="下级代理">
        <el-select filterable clearable v-model="form.agentId" placeholder="下级代理">
          <el-option v-for="i in agentList" :key="i.key" :label="i.agentName" :value="i.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户Id">
        <el-input v-model="form.userId" placeholder="用户Id"></el-input>
      </el-form-item>
      <el-form-item label="持仓订单号">
        <el-input v-model="form.positionSn" placeholder="持仓订单号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="买入时间">
          <el-date-picker
          v-model="form.time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-alert
      v-if="list.list.length>0 && list.list[0].now_price == 0"
      style="margin-bottom:10px"
      title="集合竞价中，'现价'、'浮动盈亏'、'总盈亏'暂不能查看"
      type="warning"
      close-text="知道了">
    </el-alert>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="list.list"
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="数量/股">
                <span>{{ props.row.orderNum}}</span>
              </el-form-item>
              <el-form-item label="总市值">
                <span>{{ props.row.orderTotalPrice}}</span>
              </el-form-item>
              <el-form-item label="杠杆倍数">
                <span>{{ props.row.orderLever}}</span>
              </el-form-item>
              <el-form-item label="手续费">
                <span>{{ props.row.orderFee}}</span>
              </el-form-item>
              <el-form-item label="印花税">
                <span>{{ props.row.orderSpread}}</span>
              </el-form-item>
              <el-form-item label="留仓费">
                <span>{{ props.row.orderStayFee}}</span>
              </el-form-item>
              <el-form-item label="留仓天数">
                <span>{{ props.row.orderStayDays}}</span>
              </el-form-item>
              <el-form-item v-if="props.row.isLock == 1" label="锁定原因">
                <span>{{ props.row.lockMsg}}</span>
              </el-form-item>
              <el-form-item label="买入时间">
                <span>{{props.row.buyOrderTime | timeFormat}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          width="70px"
          prop="positionType"
          label="账户类型">
          <template slot-scope="scope">
            <el-tag :type="scope.row.positionType == 1?'info':'success'">{{scope.row.positionType == 1?'模拟':'实盘'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="positionSn"
          label="持仓订单号/id">
          <template slot-scope="scope">
          <span style="font-size:12px;color:#959595;">
            {{scope.row.id}}
          </span>
            <a class="hide-td" href="javascript:;" :title="scope.row.positionSn">{{scope.row.positionSn}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="用户名/id">
          <template slot-scope="scope">
            <span>{{scope.row.nickName}}/{{scope.row.userId}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stockName"
          label="股票名称">
          <template slot-scope="scope">
            <p>
              <span :class="scope.row.stockPlate == '科创'?'kc-mark':'kc-mark a-mark'">{{scope.row.stockPlate == '科创'?'科创':'A股'}}</span>
            </p>
            <p>
              {{scope.row.stockName}}
              <span>
              ({{scope.row.stockCode}})
            </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderDirection"
          label="方向">
          <template slot-scope="scope">
            <p>
              {{scope.row.orderDirection}}
              <i v-if="scope.row.orderDirection == '买涨'" class="red iconfont icon-up"></i>
              <i v-if="scope.row.orderDirection  == '买跌'" class="green iconfont icon-down"></i>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="buyOrderPrice"
          label="买入价">
        </el-table-column>
        <el-table-column
          prop="now_price"
          label="现价">
          <template slot-scope="scope">
            <div v-if="scope.row.now_price"
                 :class="changeTextClass[scope.$index] == true?'heartBeat  tab-number':' tab-number'">
              <p
                :class="scope.row.now_price - scope.row.buyOrderPrice < 0?'green bounceIn':scope.row.now_price - scope.row.buyOrderPrice > 0?'bounceIn red':'bounceIn'">
                {{scope.row.now_price == 0?'-':scope.row.now_price}}
              </p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="orderNum"
          label="数量">
        </el-table-column> -->
        <el-table-column
          prop="profitAndLose"
          label="浮动盈亏">
          <template slot-scope="scope">
            <div class="bounceIn tab-number">
              <p :class="changeTextClass[scope.$index] == true?'heartBeat':''">
                <span v-if="scope.row.now_price == 0">-</span>
                <span v-else :class="scope.row.profitAndLose<0?'green bounceIn':'red bounceIn'">{{scope.row.profitAndLose}}</span>
              </p>
            </div>

          </template>
        </el-table-column>
        <el-table-column
          prop="allProfitAndLose"
          label="总盈亏">
          <template slot-scope="scope">
            <div class="bounceIn tab-number">
              <p :class="changeTextClass[scope.$index] == true?'heartBeat':''">
                <span v-if="scope.row.now_price == 0">-</span>
                <span v-else :class="scope.row.allProfitAndLose<0?'green bounceIn':'red bounceIn'">{{scope.row.allProfitAndLose}}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
         prop="orderLever"
         label="杠杆倍数">
       </el-table-column>
        <el-table-column
         prop="orderTotalPrice"
         label="总市值">
       </el-table-column>
        <el-table-column
         prop="orderFee"
         label="手续费">
       </el-table-column>
        <el-table-column
         prop="orderSpread"
         label="印花税">
       </el-table-column>
        <el-table-column
         prop="orderStayFee"
         label="留仓费">
       </el-table-column>
        <el-table-column
         prop="orderStayDays"
         label="留仓天数">
       </el-table-column>
       <el-table-column
         prop="buyOrderTime"
         label="买入时间"
         width="180">
         <template slot-scope="scope">
           <span>
             {{scope.row.buyOrderTime | timeFormat}}
           </span>
         </template>
       </el-table-column>
        -->
        <el-table-column
          fixed="right"
          prop="isLock"
          width="180px"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isLock == 0" type="primary" plain size="small" @click="positionLock(scope.row)">
              锁仓
            </el-button>
            <el-button v-if="scope.row.isLock == 1" type="primary" plain size="small"
                       @click="positionUnLock(scope.row)">解锁
            </el-button>
            <!-- <el-button type="primary" plain size="small" @click="toDetail(scope.row)">查看详情</el-button> -->
            <el-button type="danger" plain size="small" @click="toSell(scope.row)">强制平仓</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="list.pageNum"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="list.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list.total">
        </el-pagination>
      </div>
      <DetailDialog :info='detail' ref="detailDialog"></DetailDialog>
      <AuditDialog :info='detail' :getDate='getList' ref="auditDialog"></AuditDialog>

    </div>
  </div>

</template>

<script>
import * as api from '@/axios/api'
import DetailDialog from './detail-dialog'
import AuditDialog from './audit-dialog'

export default {
  components: {
    DetailDialog,
    AuditDialog
  },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      loading: false,
      form: {
        positionType: '',
        state: '0',
        userId: '',
        agentId: '',
        positionSn: '',
        time: '',
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
          'agentRealName': '下级1',
          'agentPhone': '18888888888',
          'agentCode': '8888'
        }
      ],
      detail: null, // 详情数据
      timer: null,
      refresh: false, // 刷新中
      changeTextClass: {} // 表格中的数据变化
    }
  },
  watch: {},
  computed: {},
  created () {
    this.timer = setInterval(this.refreshList, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    this.getList()
    this.getAgentList()
  },
  methods: {
    handleSizeChange (val) {
      this.form.pageSize = val
      this.getList()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.form.pageNum = val
      console.log(`当前页: ${val}`)
      this.getList()
    },
    async refreshList () {
      if (this.refresh || this.loading) {
        return
      }
      this.refresh = true
      this.changeTextClass = {}
      // 获取表格数据
      let opts = {
        positionType: this.form.positionType, // 正式 0 模拟 1
        state: this.form.state, // 持仓 0 平仓 1
        userId: this.form.userId,
        agentId: this.form.agentId,
        positionSn: this.form.positionSn,
        beginTime: this.form.time ? this.form.time[0] : '',
        endTime: this.form.time ? this.form.time[1] : '',
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      }
      let data = await api.Orderlist(opts)
      this.refresh = false
      if (data.status === 0) {
        data.data.list.forEach((element, i) => {
          this.changeTextClass[i] = ''
          if (data.data.list[i].now_price !== this.list.list[i].now_price) {
            // this.changeTextClass = true
            this.changeTextClass[i] = true // 设置对应的动画过滤
            this.list.list[i].now_price = data.data.list[i].now_price
            // this.list.list[i].now_price = data.data.list[i].now_price
            this.list.list[i].profitAndLose = data.data.list[i].profitAndLose
            this.list.list[i].allProfitAndLose = data.data.list[i].allProfitAndLose
          }
        })
      } else {
        this.$message.error(data.msg)
      }
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
        positionType: this.form.positionType, // 正式 0 模拟 1
        state: this.form.state, // 持仓 0 平仓 1
        userId: this.form.userId,
        agentId: this.form.agentId,
        positionSn: this.form.positionSn,
        beginTime: this.form.time ? this.form.time[0] : '',
        endTime: this.form.time ? this.form.time[1] : '',
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      }
      this.loading = true
      let data = await api.Orderlist(opts)
      this.loading = false
      if (data.status === 0) {
        this.list = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    toDetail (row) {
      console.log(row)
      // 查看详情
      this.detail = row
      this.$refs.detailDialog.dialogVisible = true
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
        if (column.property === 'orderNum' || column.property === 'profitAndLose' || column.property === 'allProfitAndLose' || column.property === 'orderFee' || column.property === 'orderSpread' || column.property === 'orderStayFee') {
          // 需要计算列 ==> 数量 浮动盈亏 总盈亏 总市值 手续费 印花税 留仓费
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
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
    toSell (row) {
      // 强制平仓
      this.$confirm('确认要强制平仓?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await api.positionSell({ positionSn: row.positionSn })
        if (data.status === 0) {
          this.$message.success(data.msg)
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
    async positionLock (row) {
      this.detail = row
      this.$refs.auditDialog.dialogVisible = true
    },
    // positionLock (row) {
    //   // 锁定
    //   this.$prompt('请输入锁定原因?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(async ({ value }) => {
    //     let opts = {
    //       positionId: row.id,
    //       state: 1,
    //       lockMsg: value
    //     }
    //     let data = await api.positionLock(opts)
    //     if (data.status === 0) {
    //       this.$message.success(data.msg)
    //       this.getList()
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '取消锁仓！'
    //     })
    //   })
    // },
    positionUnLock (row) {
      // 解锁
      this.$confirm('确认要解锁该持仓单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let opts = {
          id: row.id,
          isLock: 0
        }
        let data = await api.positionLock(opts)
        if (data.status === 0) {
          this.$message.success(data.msg)
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消解锁！'
        })
      })
    }
  }
}
</script>
