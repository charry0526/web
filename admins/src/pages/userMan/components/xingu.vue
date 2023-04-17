<template>
  <div>
    <el-form :rules="rules"
             :inline="true"
             :model="info"
             ref="ruleForm"
             class="demo-form-inline"
             size="small">
      <el-card class="box-card">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="选择股票"
                          prop="names">
              <el-input placeholder="输入股票代码查询股票信息" v-model="info.names">
                <el-button @click="search"
                           slot="append"
                           :loading="fullscreenLoading"
                           placeholder="输入股票代码查询股票信息"
                           icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">股票名字:{{info.nickname}}</el-col>
          <!-- <el-col :span="8">代码:{{info.code}}</el-col> -->
          <el-col :span="8">现价:{{info.scprice}}</el-col>
        </el-row>
        <div class="line"></div>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="上架时间"
                          prop="fxtime">
              <el-date-picker style="width:300px"
                              v-model="info.fxtime"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择上架时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="买入价格"
                          prop="price">
              <el-input style="width:300px"
                        placeholder="输入所选择时间点对应的价格"
                        v-model="info.price"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="杠杆倍数"
                          prop="lever">
              <el-input style="width:300px"
                        placeholder="输入买入杠杆倍数"
                        v-model="info.lever"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态"
                          prop="zt">
              <el-radio-group v-model="info.zt">
                <el-radio :label="1">启动</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="最低数量"
                          prop="num">
              <el-input style="width:300px"
                        placeholder="请选择数量"
                        v-model="info.num">
                <el-select v-model="info.num"
                           slot="prepend"
                           placeholder="请选择">
                  <el-option v-for="item in numData"
                             :key="item.id"
                             :label="item.label+'股'"
                             :value="item.label"></el-option>

                </el-select>
                <el-button slot="append">股</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="text-center submit-btn">
          <el-button @click="submitForm('ruleForm')"
                     type="primary">创建持仓单</el-button>
        </el-row>
      </el-card>

    </el-form>

    <DetailDialog @createOrder="createOrder" :info="info"  ref="detailDialog">
    </DetailDialog>
  </div>

</template>

<script>
import * as api from '@/axios/api'
import DetailDialog from '../cpn/DetailDialog.vue'
export default {
  components: {
    DetailDialog
  },
  props: {},
  data () {
    return {
      info: {
        nickname: '',
        // code: '',
        scprice: '',
        names: '',
        lever: '1/3/5/10',
        zt: 1
      },
      rules: {
        names: [
          { required: true, message: '请选择股票', trigger: 'blur' }
        ],
        fxtime: [
          { required: true, message: '请选择上架时间', trigger: 'change' }
        ],
        price: [
          { required: true, message: '输入所选择时间点对应的价格', trigger: 'blur' },
          {
            pattern: /^-?\d{1,9}(,\d{9})*(\.\d{1,2})?$/,
            message: '请输入正确格式',
            trigger: 'blur'
          }
        ],
        lever: [
          { required: true, message: '输入买入杠杆倍数', trigger: 'change' }
        ],
        zt: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请选择数量', trigger: 'change' },
          {
            pattern: /^-?\d{1,9}(,\d{9})*(\.\d{1,2})?$/,
            message: '请输入正确格式',
            trigger: 'blur'
          }
        ]
      },
      numData: [], // 最低数量数据
      fullscreenLoading: false
    }
  },
  watch: {},
  computed: {},
  mounted () {
    this.getnumData()
  },
  methods: {
    /**
     * 重置
     */
    restet () {
      for (const key in this.info) {
        this.info[key] = ''
      }
      this.info.lever = '1/3/5/10'
      this.info.zt = 1
      this.$refs.detailDialog.dialogVisible = false
    },
    /**
     * 确认 创建
     */
    createOrder () {
      api.addESOP(this.info).then(res => {
        if (res.status == 0) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
        }
        console.log(2)
        this.restet()
      }).catch(() => {
        console.log(111)
        this.restet()
      })
    },
    /**
     * 搜索股票
     */
    search () {
      if (!this.info.names) {
        this.$message({
          message: '请先填写股票',
          type: 'warning'
        })
        return false
      }
      this.fullscreenLoading = true
      api.getSingleStock({code: this.info.names}).then(res => {
        console.log(res)
        const data = res.data
        const {code, name, nowPrice} = data
        if (res.status == 0) {
          this.info.nickname = name
          // this.info.code = name
          this.info.scprice = nowPrice
        }
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    /**
     * describe 获取最低数量
     */
    getnumData () {
      this.numData = [{ id: 0, label: '1' }, { id: 1, label: '2' }, { id: 2, label: '4' }, { id: 3, label: '6' }, { id: 4, label: '8' }, { id: 5, label: '10' }]
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.detailDialog.dialogVisible = true
          console.log(this.info)
          // xxx().then(res=>{
          // console.log();
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.table .el-table .warning-row {
  background: rgba(245, 108, 108, 0.1);
}

.el-card .pro {
  font-size: 14px;
  color: #f44336;
  margin-left: -5px;
  line-height: 30px;
}

.sub-tit {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.form-input {
  width: 80%;
}

.item {
  a {
    color: #333;
  }
}

.submit-btn {
  margin: 20px 0;

  .el-button {
    width: 200px;
  }
}

/deep/.el-loading-spinner{
  transform: translateY(-50%);
  margin-top: 0;
}
.line {
  width: 98%;
  height: 1px;
  margin: 20px auto;
  background-color: #eee;
}
/deep/.el-button--primary {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}
</style>
