import { AJAX_GET, AJAX_POST } from '../helpers/ajax'

export default {
    async getCurrentUser() {
        return await AJAX_POST('/current-user')
    },
    async resendVerifyEmail(payload) {
        return await AJAX_POST('/resend-verify-email')
    },
    async request(id) {
        return await AJAX_POST(`/my-estimates/request/${id}`)
    },
    async sendNewAddress(payload) {
        return await AJAX_POST(`/my-estimates/request/${payload.id}/new-address`, payload)
    },
    async addToExistingEstimate(url, params) {
        return await AJAX_POST(url, params)
    },
    async createNewEstimate(url, params) {
        return await AJAX_POST(url, params)
    },
}