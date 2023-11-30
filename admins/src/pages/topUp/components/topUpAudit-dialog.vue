<template>
  <div class="wrapper">
    <el-dialog
      title="信用金还款审核"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form :inline="true" :model="form" ref="ruleForm" label-width="100px" :rules="rule" class="demo-form-inline">
           <el-form-item label="id" prop="id" v-if="false">
            <el-input v-model="info.id" id="id" placeholder="id" v-if="false"></el-input>
          </el-form-item>
           <el-form-item label="userId" prop="userId" v-if="false">
            <el-input v-model="info.userId" id="userId" placeholder="userId" v-if="false"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="userName">
            <el-input disabled v-model="info.userName" placeholder="用户名称"></el-input>
          </el-form-item>
           <el-form-item label="手机号" prop="phone">
            <el-input disabled v-model="info.phone" placeholder="手机号"></el-input>
          </el-form-item>
           <el-form-item label="还款金额" prop="topupMoney">
            <el-input disabled v-model="info.topupMoney" placeholder="充值金额"></el-input>
          </el-form-item>

          <!-- <el-form-item label="充值时间" prop="topupTime">
            <el-input disabled v-model="info.topupTime" placeholder="充值时间"></el-input>
          </el-form-item> -->

         <el-form-item label="审核状态" prop="topupStatus">
            <el-select v-model="form.topupStatus" placeholder="审核状态" id="topupStatus">
              <el-option label="审核中" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核不通过" value="2"></el-option>
<!--              <el-option label="未审核" value="3"></el-option>-->
            </el-select>
          </el-form-item>
            <el-form-item label="审核原因" prop="auditReason">
            <el-input  type="textarea" v-model="form.auditReason" placeholder="审核原因"></el-input>
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
        auditStatus: '',
        auditReason: ''
      }
    }
  },
  watch: {
    info (val) {
      if (val) {
        this.form.id = this.info.id
        this.form.userId = this.info.userId

      }
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let opts = {
            id: this.info.id,
            userId: this.form.userId,
            topupStatus: this.form.topupStatus,
            auditReason: this.form.auditReason,
            topupMoney: this.form.topupMoney
          }
          let data = await api.topuptAudit(opts)
          if (data.status === 0) {
            this.$message.success(data.msg)
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
