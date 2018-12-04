<template>
  <el-dialog
    :visible.sync="show" :title="title[dialogStatus]" :close-on-click-modal="false">
    <div>
      <el-form ref="form" :model="orgForm" label-width="100px"  :rules="rules" >
        <el-form-item label="父级id" label-width="100px" :hidden="true" prop="orgPid">
          <el-input v-model="orgForm.orgPid"></el-input>
        </el-form-item>
        <el-form-item label="父级部门" label-width="100px">
          <el-cascader
            :props="treeRoles"
            :options="options"
            expand-trigger="hover"
            :show-all-levels="false"
            change-on-select
            @change="queryOrgList">
          </el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="orgName">
          <el-input v-model="orgForm.orgName"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="orgAddress">
          <el-input v-model="orgForm.orgAddress"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="orgRemark">
          <el-input v-model="orgForm.orgRemark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import orgApi from '@/api/organization'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      orgForm: {
        Type: Array,
        required: true
      },
      dialogStatus: {
        Type: String,
        required: true
      },
      title: {
        Type: Map,
        required: true
      }
    },
    watch: {
      show (val) {
        if (!val) {
          this.$emit('update:visible', val)
          this.options = [{
            orgId: '21000',
            orgName: '普元信息技术',
            children: []
          }]
        }
      },
      visible (val) {
        if (val) {
          this.show = this.visible
        }
      }
    },
    data() {
      return {
        show: false,
        //选中的id
        optionId: null,
        rules: {
          orgName: [
            {required: true, trigger: "change", message: "请输入部门名称!"}
          ],
          orgAddress: [
            {required: true, trigger: "change", message: "请输入地址!"}
          ]
        },
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
      }
    },
    methods: {
      //懒加载下拉选
      async queryOrgList (val) {
        this.optionId = val[val.length - 1]
        this.orgForm.orgPid = this.optionId
        let resp = await orgApi.queryOrgsByPid(val[val.length - 1])
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
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            let resp
            if(this.dialogStatus) {
              resp = await orgApi.modify(this.orgForm)
            }else {
              resp = await orgApi.create(this.orgForm)
            }
            if(resp.code === 200) {
              this.visible = false
              this.$emit('success')
              this.$message({
                message: '操作成功',
                type: 'success'
              })

            }
          }
        })
      }
    },
  };
</script>
