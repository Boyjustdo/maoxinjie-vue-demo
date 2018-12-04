<template>
  <section>
    <el-tree
      node-key="id"
      :props="defaultProps"
      :load="loadNodes"
      lazy
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span @click="queryUsersByOrgId(data)">{{ node.label }}</span>
        <span class="render-content">
          <el-button
            class="fa"
            type="text"
            size="mini"
            icon="el-icon-plus"
            @click="createOrgTree(data)">
          </el-button>
          <el-button
            class="fa"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="modifyOrgtree(data)">
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="deleteOrgTree(data)">
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-card class="box-card">
        <user-index :orgId="userOrgId"></user-index>
    </el-card>
    <org-form :visible.sync="dialogVisible" :orgForm="orgForm" :dialogStatus="dialogStatus" :title="title" @success="loadData"></org-form>
  </section>

</template>

<script>

  import OrgForm from './form.vue'
  import UserIndex from '../user/index.vue'
  import OrgApi from '@/api/organization';
  export default{
    components: {OrgForm,UserIndex},
    name: 'index',
    data () {
      return {
        defaultProps: {
          id: 'orgId',
          label: 'orgName',
          children: 'children'
        },
        userOrgId: null,
        title: {
          true: '修改组织机构',
          false: '新增组织机构'
        },
        //表单状态
        dialogStatus: '',
        //是否可见可用
        dialogVisible: false,
        orgForm: {
          orgId: null,
          orgName: '',
          orgAddress: null,
          orgPid: null,
          orgRemark: null,
        }
      }
    },
    mounted() {
    },
    methods: {
      //懒加载时触发
      async loadNodes(node, resolve) {
        if (node.level === 0) {
          let resp = await OrgApi.queryOrgsByPid(node.level)
          return resolve(resp.data);
        }
        if(node.level > 0) {
          let resp = await OrgApi.queryOrgsByPid(node.data.orgId)
          return resolve(resp.data);
        }
      },
      loadData(){
          this.$router.push({ name: '组织机构'})
      },
      /*删除操作*/
      deleteOrgTree (data) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let id = data.orgId
          let resp = await OrgApi.remove(id)
          if (resp.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.loadData()
          } else if (resp.code === 500) {
            this.$message({
              message: resp.msg,
              type: 'failed'
            })
          }
        }).catch(() => {
        })
      },
      //添加操作
      createOrgTree() {
        this.dialogVisible = true
        this.dialogStatus = false
        // 对象赋值
        this.orgForm = {
          orgId: null,
          orgName: '',
          orgAddress: null,
          orgPid: null,
          orgRemark: null,
        }
      },
      //修改操作
      modifyOrgtree(data) {
        this.dialogVisible = true
        this.dialogStatus = true
        // 数据隔离
        this.orgForm.orgId = data.orgId
        this.orgForm.orgName = data.orgName
        this.orgForm.orgAddress = data.orgAddress
        this.orgForm.orgPid = data.orgPid
        this.orgForm.orgRemark = data.orgRemark
      },
      // 查询
      async queryUsersByOrgId (data) {
        this.userOrgId = data.orgId
      },
    },

  }
</script>

<style scoped>

</style>
