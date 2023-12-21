<template>
  <div class="wrapper">
    <el-dialog
      title="账户扣入款"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form label-width="100px" :model="form" ref="ruleForm" :rules="rule" class="demo-form-inline">
          <el-form-item label="用户id" prop="id">
            <el-input disabled v-model="info.id" placeholder="代理名"></el-input>
          </el-form-item>
          <el-form-item label="信用评分" prop="creditScore">
            <el-input v-model="form.creditScore" placeholder="金额"></el-input>
          </el-form-item>
          <el-form-item label="信用贷款额度" prop="creditLimit">
            <el-input v-model="form.creditLimit" placeholder="金额"></el-input>
          </el-form-item>
          <el-form-item label="已贷款金额" prop="amountBorrowed">
            <el-input v-model="form.amountBorrowed" placeholder="金额"></el-input>
          </el-form-item>
          <p style="margin-left:100px;" class="red">
            该操作会直接修改用户账户信用金额及可贷金额
          </p>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/axios/api'

export default {
  components: {},
  props: {
    getDate: {
      type: Function,
      default: function () {

      }
    },
    info: {
      type: Object,
      default: function () {
        return {
          id: ''
        }
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        id: '',
        creditScore: '',
        creditLimit: '',
        amountBorrowed: ''
      }
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let opts = {
            userId: this.info.id,
            creditScore: this.form.creditScore,
            creditLimit: this.form.creditLimit,
            amountBorrowed: this.form.amountBorrowed
          }
          let data = await api.updateCreditAmt(opts)
          if (data.status === 0) {
            this.$message.success(data.msg)
            this.clearForm()
            this.getDate()
          } else {
            this.$message.error(data.msg)
          }
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    clearForm () {
      this.form.creditScore = ''
      this.form.creditLimit = ''
      this.form.amountBorrowed = ''
    }
  }
}
</script>
<style lang="less" scoped>
</style>
