import axios from 'axios'
import { getErrorFromServer } from '../../helpers/objects'
import { notify } from "@kyvg/vue3-notification"
import router from '@/router'

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
      'x-origin': getOrigin(),
    }
})

function getOrigin() {
  const origin = window.location.origin
  const isLocalhost = origin.includes('localhost')
  return isLocalhost ? process.env.VUE_APP_ORIGIN : origin
}


instance.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const parsedError = getErrorFromServer(error.response.data)
  notify(parsedError)

  const status = error.response.status
  
  if(status) {
    switch(status) {
      case 401:
        localStorage.clear()
        router.push({
          name: 'login'
        })
    }
  }

  return Promise.reject(error)
})

export default instance

