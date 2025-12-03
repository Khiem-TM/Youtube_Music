import axios from 'axios'

const LOCAL_BASE_URL = 'http://localhost:8080'

const localApi = axios.create({ baseURL: LOCAL_BASE_URL, headers: { 'Content-Type': 'application/json' } })

const localAuth = {
  register: async ({ email, password, optInLocal = true, externalUserId }) => {
    const res = await localApi.post('/local-auth/register', { email, password, optInLocal, externalUserId })
    return res.data
  },
  login: async ({ email, password }) => {
    const res = await localApi.post('/local-auth/login', { email, password })
    return res.data
  },
}

export default localAuth
