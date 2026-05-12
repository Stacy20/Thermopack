import axios from 'axios'
import { getApiBase } from '../config/apiBase'

const apiClient = axios.create({
  baseURL: getApiBase(),
})

export default apiClient
