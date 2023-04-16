<template>
  <div class="wrapper">
    <el-dialog title="详情 "
               :visible.sync="dialogVisible"
               width="70%">
      <div>
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            您所创建的自由订单详情
          </div>
          <div v-if="info"
               class="text box-content">
            <el-row>
              <el-col :span="8">
                股票名称：
                <span>
                  {{info.names}}
                </span>
              </el-col>
              <!-- <el-col :span="8">
                股票代码：
                <span>
                  {{info.code}}
                </span>
              </el-col> -->
              <el-col :span="8">
                买入价格：
                <span>
                  {{info.price}}
                </span>
              </el-col>
              <el-col :span="8">
                现价：
                <span>
                  {{info.scprice}}
                </span>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="8">
                杠杆倍数：
                <span>
                  {{info.lever}}
                </span>
              </el-col>
              <el-col :span="8">
                总市值：
                <span>
                  {{Number(info.num)*info.price}}
                </span>
              </el-col>
                <el-col :span="8">
                状态：
                <span>
                  {{info.zt?'启动':'隐藏'}}
                </span>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="8">
                浮动盈亏：
                <span class="active">
                  {{info.price-Number(info.num)*info.scprice}}
                </span>
              </el-col>
            </el-row>
            <p class="content">
            </p>
          </div>
        </el-card>
        <el-row class="text-center submit-btn">
          <el-button @click="createOrder"
                     type="primary">创建持仓单</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/axios/api'

export default {
  components: {},
  props: {
    info: {
      type: Object,
      default: function () {
        return {
          accountType: 0,
          agentId: 1,
          agentName: '总代理',
          enableAmt: 11266.34,
          id: 11,
          idCard: '132567788432',
          isActive: 2,
          isLock: 0,
          phone: '18163912132',
          profitAndLose: 0,
          realName: '认证',
          regAddress: '局域网',
          riskRate: 1,
          userAmt: 11266.34
        }
      }
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {},
  computed: {},
  created () { },
  mounted () {
  },
  methods: {
    createOrder () {
      this.$emit('createOrder')
    }
  }
}
</script>
<style lang="less" scoped>
.info-img {
  height: 150px;
}

.content {
  text-indent: 2em;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dotted #ccc;
}

.summary {
  color: #696969;
  text-indent: 2em;
}
.box-card {
  margin-bottom: 30px;
}
.active {
  font-size: 16px;
  font-weight: 700;
  color: green;
}
</style>
