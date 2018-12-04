<template>
  <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="filters.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="filters.sex" placeholder="性别">
              <el-option label="请选择" value=""></el-option>
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryUsers">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    <!--列表-->
      <el-table :data="userData" highlight-current-row v-loading="dataLoading" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="userName" label="姓名" sortable></el-table-column>
        <el-table-column prop="userAccount" label="账号" sortable></el-table-column>
        <el-table-column prop="userAge" label="年龄" sortable></el-table-column>
        <el-table-column  label="性别" >
          <template slot-scope="scope">
            {{sexConvert(scope.row.userSex)}}
          </template>
        </el-table-column>
        <el-table-column prop="userPhone" label="电话" ></el-table-column>
        <el-table-column label="可用状态" >
          <template slot-scope="scope">
            {{formatStatus(scope.row.userStatus)}}
          </template>
        </el-table-column>
        <el-table-column prop="org.orgName" label="所属部门" ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="modifyUser(scope.row)">编辑</el-button>
            <el-button  type="danger" @click="removeUser(scope.row.userId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="pageChange" background :page-sizes="[10, 50, 100]" :page-size="10"  :total="total" style="float:right;">
      </el-pagination>
    </el-col>
    <UserForm :visible.sync="visible" :title="title" :dialogStatus="dialogStatus" @success="loadData" :initUserData="initUserData"></UserForm>
  </section>

</template>

<script>

  import UserForm from './form.vue'
  import userApi from '@/api/user';
  export default{
    components: {UserForm},
    name: 'index',
    props: {
      orgId: {
        Type: Number
      }
    },
    watch: {
      orgId (val) {
        if (val) {
          this.filters.orgId = this.orgId
        }
        this.loadData()
      }
    },
    data () {
      return {
        //过滤条件
        filters: {
          name: '',
          sex: '',
          orgId: 0
        },
        //数据加载
        dataLoading: false,
        userData: [],
        initUserData: {
          userId: null,
          userName: null,
          userAccount: null,
          userPwd: null,
          userSex: null,
          userAge: null,
          userPhone: null,
          org: {
            orgId: null
          }
        },
        total: 0,
        query: {
          pageNum: 1,
          pageSize: 10
        },
        visible: false,//新增界面是否显示
        title: {
          update: '修改用户',
          create: '添加用户'
        },
        dialogStatus: '',
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      sexConvert(sex){
        return sex == 1 ? '男' : sex == 0 ? '女' : '未知';
      },
      formatStatus(status){
        return status == 1 ? '可用' : status == 0 ? '不可用' : '未知';
      },
      queryUsers() {
          this.dataLoading = true;
          this.loadData()
      },
      async loadData(){
        let resp = await userApi.paging(this.query,this.filters)
        debugger
        this.userData = resp.data.list
        this.total = resp.data.total
        this.dataLoading = false;
      },
      pageChange(page){
        this.query.pageNum = page
        this.loadData()
      },
      //添加操作
      addDialog() {
        this.visible = true
        this.dialogStatus = 'create'
      },
      /*删除操作*/
      removeUser(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let resp = await userApi.remove(id)
          if(resp.code == 200) {
            this.$message({
              message: "删除成功!",
              type: "success"
            })
          }
          this.loadData()
        }).catch(() => {

        });

      },
      // 编辑方法
      modifyUser(data) {
        this.dialogStatus = 'update'
        this.visible = true
        //获取修改初始化的数据
        this.initUserData.userId = data.userId
        this.initUserData.userName = data.userName
        this.initUserData.userAccount = data.userAccount
        this.initUserData.userPwd = data.userPwd
        this.initUserData.userSex = data.userSex
        this.initUserData.userAge = data.userAge
        this.initUserData.userPhone = data.userPhone
        this.initUserData.org.orgId = data.org.orgId
      },
    },

  }
</script>

<style scoped>

</style>
