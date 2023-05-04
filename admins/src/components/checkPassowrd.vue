<template>
  <div>
    <el-dialog title="密码验证"
               :visible.sync="dialogVisible"
               width="40%"
               :before-close="handleClose">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="80px"
               class="demo-ruleForm">
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="ruleForm.password"
                    placeholder="请输入密码,密码正确后进行后续操作"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as api from '@/axios/api'

export default {
  props: {
    // passwordValue: {
    //   type: [Number, String]
    // }
  },
  data () {
    return {
      dialogVisible: false,
      rules: {
        password: [
          { required: true, message: '请输入密码,密码正确后进行后续操作', trigger: 'blur' }
        ]
      },
      ruleForm: {
        password: ''
      }
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    handleClose () {
      this.resetForm('ruleForm')
      this.dialogVisible = false
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { password } = this.ruleForm
          let data = await api.passwordRichter({ password })
          if (data.status == 0) {
            this.$message.success('验证成功')
            this.handleClose()
            setTimeout(() => {
              this.$emit('callback')
            }, 1000)
          } else {
            this.$message.error('验证失败，请重新输入密码')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }

}
</script>
<style>
</style>
