<template>
  <div class="wrapper">
    <el-dialog
      title="添加信用金模板"
      :visible.sync="dialogVisible"
      width="50%">
      <div>
        <el-form :inline="true" :model="form" ref="ruleForm" label-width="80px" :rules="rule" class="demo-form-inline">
          <el-form-item label="信用评分" prop="creditScore">
            <el-input v-model="form.creditScore" placeholder="信用评分"></el-input>
          </el-form-item>
           <el-form-item label="贷款额度" prop="creditLimit">
            <el-input v-model="form.creditLimit" placeholder="贷款额度"></el-input>
          </el-form-item>
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
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        creditScore: '',
        creditLimit: ''
      },
      rule: {
        creditScore: [
          { required: true, message: '信用评分', trigger: 'blur' }
        ],
        creditLimit: [
          { required: true, message: '贷款额度', trigger: 'blur' }
        ]
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
            creditScore: this.form.creditScore,
            creditLimit: this.form.creditLimit
          }
          let data = await api.templatettAdd(opts)
          if (data.status === 0) {
            this.$message.success('创建模板成功')
            this.getDate()
          } else {
            this.$message.error(data.msg)
          }
          this.dialogVisible = false
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
