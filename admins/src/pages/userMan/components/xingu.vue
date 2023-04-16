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
                          prop="name">
              <el-input v-model="info.name">
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
          <el-col :span="8">代码:{{info.code}}</el-col>
          <el-col :span="8">现价:{{info.currentPrice}}</el-col>
        </el-row>
        <div class="line"></div>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="上架时间"
                          prop="data">
              <el-date-picker style="width:300px"
                              v-model="info.data"
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
                          prop="multiple">
              <el-input style="width:300px"
                        placeholder="输入买入杠杆倍数"
                        v-model="info.multiple"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态"
                          prop="status">
              <el-radio-group v-model="info.status">
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
                             :label="item.label+'手'"
                             :value="item.label"></el-option>

                </el-select>
                <el-button slot="append">手</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="text-center submit-btn">
          <el-button @click="submitForm('ruleForm')"
                     type="primary">主要按钮</el-button>
        </el-row>
      </el-card>

    </el-form>

    <!-- <DetailDialog  ref="detailDialog"></DetailDialog> -->
  </div>

</template>

<script>
import * as api from '@/axios/api'
// import DetailDialog from './detail-dialog'
export default {
  components: {
    // DetailDialog,
  },
  props: {},
  data () {
    return {
      info: {
        nickname: '',
        code: '',
        currentPrice: '',
        name: '',
        status: 1
      },
      rules: {
        name: [
          { required: true, message: '输入股票代码查询股票信息', trigger: 'blur' }
        ],
        data: [
          { required: true, message: '请选择上架时间', trigger: 'change' }
        ],
        price: [
          { required: true, message: '输入所选择时间点对应的价格', trigger: 'blur' },
          {
            pattern: /^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
            message: '请输入正确格式',
            trigger: 'blur'
          }
        ],
        multiple: [
          { required: true, message: '输入买入杠杆倍数', trigger: 'change' },
          {
            pattern: /^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
            message: '请输入正确格式',
            trigger: 'blur'
          }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请选择数量', trigger: 'change' },
          {
            pattern: /^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
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
     * 搜索股票
     */
    search () {
      if (!this.info.name) {
        this.$message({
          message: '请先填写股票',
          type: 'warning'
        })
        return false
      }
      this.fullscreenLoading = true
      setTimeout(() => {
        this.info.nickname = '必赚'
        this.info.code = '123'
        this.info.currentPrice = '16.36'
        this.fullscreenLoading = false
      }, 2000)
    },
    /**
     * describe 获取最低数量
     */
    getnumData () {
      this.numData = [{ id: 0, label: '1' }, { id: 1, label: '2' }]
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
