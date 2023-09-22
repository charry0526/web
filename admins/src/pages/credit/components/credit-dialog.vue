<template>
  <div class="wrapper">
    <el-dialog
      title="信用金审核"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form :inline="true" :model="form" ref="ruleForm" label-width="80px" :rules="rule" class="demo-form-inline">
           <el-form-item label="用户ID" prop="userId">
            <el-input disabled v-model="info" placeholder="用户ID"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="userName">
            <el-input disabled v-model="info" placeholder="用户名称"></el-input>
          </el-form-item>
           <el-form-item label="申请贷额度" prop="amountCreditApplied">
            <el-input disabled v-model="info" placeholder="申请贷额度"></el-input>
          </el-form-item>
          <el-form-item label="审核状态" prop="auditStatus">
            <el-select v-model="form.auditStatus" placeholder="审核状态">
              <el-option label="审核通过" value="2"></el-option>
              <el-option label="审核不通过" value="3"></el-option>
            </el-select>
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
    },
    info: {
      type: Number
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        userId: '',
        userName: '',
        amountCreditApplied: ''
      },
      rule: {
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
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
            userId: this.form.userId,
            auditStatus: this.form.auditStatus
          }
          let data = await api.creaditAudit(opts)
          if (data.status == 0) {
            this.$message.success('审核成功')
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
