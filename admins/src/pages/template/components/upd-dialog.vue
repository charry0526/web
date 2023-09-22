<template>
  <div class="wrapper">
    <el-dialog
      title="信用金模板修改"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form :inline="true" :model="form" ref="ruleForm" label-width="90px" :rules="rule" class="demo-form-inline">
          <el-form-item label="id" prop="id" v-if="false">
            <el-input v-model="info.id" id="id" placeholder="id" v-if="false"></el-input>
          </el-form-item>
          <el-form-item label="信用评分" prop="creditScore">
            <el-input v-model="form.creditScore" placeholder="信用评分"></el-input>
          </el-form-item>
           <el-form-item label="申请贷额度" prop="creditLimit">
            <el-input v-model="form.creditLimit" placeholder="申请贷额度"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="delFlag">
            <el-select v-model="form.delFlag" placeholder="状态">
              <el-option label="启动" value="0"></el-option>
              <el-option label="暂停" value="1"></el-option>
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
        id: '',
        creditScore: '',
        creditLimit: '',
        delFlag: ''
      }
    }
  },
  watch: {
    info (val) {
      if (val) {
        this.form.id = this.info.id
        this.form.creditScore = this.info.creditScore
        this.form.creditLimit = this.info.creditLimit
        this.form.delFlag = this.info.delFlag
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
            id: this.form.id,
            creditScore: this.form.creditScore,
            creditLimit: this.form.creditLimit,
            delFlag: this.form.delFlag
          }
          let data = await api.templatettUpd(opts)
          if (data.status == 0) {
            this.$message.success('修改成功')
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
