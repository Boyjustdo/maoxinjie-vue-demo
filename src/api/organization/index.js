import axios from 'axios'


export default {
  create: async (organization) => {
    let resp = await axios.post('/api/organizations/',organization)
    return resp.data
  },
  remove: async (id) => {
    let resp = await axios.delete(`/api/organizations/${id}`)
    return resp.data
  },
  modify: async (organization) => {
    let resp = await axios.put('/api/organizations/',organization)
    return resp.data
  },
  paging: async ({pageNum,pageSize},{orgName}) => {
    let resp = await axios.get(`/api/organizations/?pageNo=${pageNum}&pageSize=${pageSize}&orgName=${orgName}`)
    return resp.data
  },
  queryOrgsByPid: async (pid) => {
    let resp = await axios.get(`/api/organizations/queryList?pid=${pid}`)
    return resp.data
  }
}
