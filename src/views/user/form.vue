<template>
  <el-dialog
      :visible.sync="visible" :title="title[dialogStatus]" >

    <div>
      <el-form ref="form" :model="initUserData" label-width="100px"  :rules="rules">
        <el-form-item label="姓名" prop="userName">
            <el-input v-model="initUserData.userName"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="userAccount">
            <el-input v-model="initUserData.userAccount"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-input type="password" v-model="initUserData.userPwd"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-radio-group v-model="initUserData.userSex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="userAge">
          <el-input-number v-model="initUserData.userAge" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="电话" prop="userPhone">
          <el-input v-model="initUserData.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="部门id" prop="org.orgId" :hidden="true">
          <el-input v-model="initUserData.org.orgId"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="org.orgId">
          <el-cascader
            :props="treeRoles"
            :options="options"
            expand-trigger="hover"
            :show-all-levels="false"
            change-on-select
            @change="queryOrgList">
          </el-cascader>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="dialogStatus === 'update'" type="primary" @click="modifyUser">确认修改</el-button>
      <el-button v-if="dialogStatus === 'create'" type="primary" @click="saveUser">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import userApi from '@/api/user'
  import orgApi from '@/api/organization'

  export default {
      props: {
        visible:{
            type: Boolean,
            default: false
        },
        dialogStatus: {
          Type: String,
          required: true
        },
        title: {
          Type: Map,
          required: true
        },
        initUserData: {
          Type: Array,
          required: true
        },
      },
    watch: {
      visible(val) {
        if (this.title === '修改用户') {
          this.initUserData = this.formData
        }
        if (!val) {
          this.$emit("update:visible", false)
          if (this.title === '新增用户') {
            this.userForm = {
              username: null,
              password: null,
              deptId: null,
            }
          }
          this.$refs["form"].resetFields()
        }
      }
    },
    data() {
        return {
          //级联的options
          options: [{
            orgId: '21000',
            orgName: '普元信息技术',
            children: [],
          }],
          //级联props
          treeRoles: {
            value: 'orgId',
            label: 'orgName',
            children: 'children'
          },
          //选中的id
          optionId: null,
          rules:{
            userName:[
                { required:true,trigger: "change",message:"请输入姓名!"}
              ],
            userAccount:[
                { required:true,trigger: "change",message:"请输入账号!"}
              ],
            userPwd: [
              {required:true, trigger: "change", message:"请输入密码!"}
            ]
          },
          userForm: {
            userName: null,
            userAccount: null,
            userPwd: null,
            userSex: null,
            userAge: null,
            userPhone: null,
            org: {
              orgId: null
            }
          }
        }
    },
    methods: {
      //懒加载下拉选
      async queryOrgList (val) {
        this.optionId = val[val.length - 1]
        this.initUserData.org.orgId = this.optionId
        let resp = await orgApi.queryOrgsByPid(this.optionId)
        if (resp.data.length > 0) {
          if (val.length === 1) {
            this.options[0].children = resp.data
          }
          if (val.length === 2) {
            this.options[0].children.forEach((items, index) => {
              if (this.optionId === items.orgId) {
                this.$set(items, 'children', resp.data)
              }
            })
          }
          if (val.length === 3) {
            this.options[0].children.forEach((items, index) => {
              if (items.children) {
                items.children.forEach((itemss, index) => {
                  if (this.optionId === itemss.orgId) {
                    this.$set(itemss, 'children', resp.data)
                  }
                })
              }
            })
          }
        }
      },
      saveUser() {
          this.$refs["form"].validate(async (valid) => {
             if(valid) {
               let resp = await userApi.create(this.initUserData)
               if(resp.code == 200) {
                 this.visible = false
                 this.$emit("success")
                 this.$message({
                   message: "添加成功",
                   type: "success"
                 })
                /* this.loadData()*/
               }
             }
          } )
      },
      // 修改
      modifyUser () {
        this.$refs["form"].validate(async valid => {
          if (valid) {
            let resp = await userApi.modify(this.initUserData)
            if (resp.code === 200) {
              this.visible = false
              this.$emit('success')
              this.$message({
                message: '修改成功',
                type: 'success'
              })

            }
          }
        })
      }
    }
  }
</script>
