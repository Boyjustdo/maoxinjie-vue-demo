import axios from 'axios'


export default {
  login: async (param) => {
    let resp = await axios.post('/api/users/login',param)
    return resp.data
  },
  create: async (user) => {
    let resp = await axios.post('/api/users/',user)
    return resp.data
  },
  remove: async (id) => {
    let resp = await axios.delete(`/api/users/${id}`)
    return resp.data
  },
  modify: async (user) => {
    let resp = await axios.put('/api/users/',user)
    return resp.data
  },
  paging: async ({pageNum,pageSize},{name,sex,orgId}) => {
    let resp = await axios.get(`/api/users/?pageNo=${pageNum}&pageSize=${pageSize}&userName=${name}&sex=${sex}&orgId=${orgId}`)
    return resp.data
  }
}
