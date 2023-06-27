<template>
  <div>
    <el-card class="box-card">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="address">
          <el-input placeholder="请输入客服地址" v-model="ruleForm.address">
            <!-- <template slot="prepend">Http://</template> -->
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即修改</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as api from "@/axios/api";

export default {
  components: {},
  data() {
    return {
      ruleForm: {
        address: ""
      },
      rules: {
        address: [{ required: true, message: "请填写地址", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getAddress();
  },
  methods: {
    getAddress() {
      api.getCusAddress().then(res => {
        if (res.status === 0) {
          this.ruleForm.address = res.data;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { address } = this.ruleForm;
          api.setCusAddress({ address }).then(res => {
            if (res.status === 0) {
              this.$message.success("修改成功");
              // this.getDate();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.table .el-table .warning-row {
  background: rgba(245, 108, 108, 0.1);
}
</style>
