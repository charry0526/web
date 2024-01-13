<template>
  <div class="wrapper">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form :inline="true" :model="form" ref="ruleForm" label-width="100px" :rules="rule" class="demo-form-inline">
           <el-form-item label="id" prop="id" v-if="false">
            <el-input v-model="info.id" id="id" placeholder="id" v-if="false"></el-input>
          </el-form-item>
          <el-form-item label="锁定原因" prop="lockMsg">
            <el-input v-model="form.lockMsg" placeholder="锁定原因"></el-input>
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
        lockMsg: ''
      }
    }
  },
  watch: {
    info (val) {
      if (val) {
        this.form.id = this.info.id
        this.form.lockMsg = this.info.lockMsg
      }
    }},
  computed: {},
  created () {},
  mounted () {},
  methods: {
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let opts = {
            positionId: this.info.id,
            state: 1,
            lockMsg: this.form.lockMsg
          }
          let data = await api.positionLock(opts)
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
