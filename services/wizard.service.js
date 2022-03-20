import { AJAX_POST, AJAX_GET, AJAX_PUT } from '../helpers/ajax'

export default {
    async init(payload) {
        return await AJAX_POST('/product-builder/initialise', payload, this.getArgAuth())
    },
    async nextStep(payload) {
        return await AJAX_POST('/product-builder/next', payload, this.getArgAuth())
    },
    async setOptionColor(payload) {
        return await AJAX_PUT('/product-builder/option-colour', payload, this.getArgAuth())
    },
    async routeBack(payload) {
        return await AJAX_POST('/product-builder/back', payload, this.getArgAuth())
    },
    async routeJumpTo(id, payload) {
        return await AJAX_POST(`/product-builder/jump-to/${id}`, payload, this.getArgAuth())
    },
    async save(type, payload) {
        return await AJAX_POST(`/product-builder/${type}`, payload)
    },
    async getFromPrice(type, id, payload) {
        return await AJAX_POST(`/product-builder/from-price/${type}/${id}`, payload, this.getArgAuth())
    },
    async getColors(colorGroup = 1717) {
        return await AJAX_GET(`/product-builder/option/colours/${colorGroup}`, this.getArgAuth())
    },
    async cloneItem(type = 'position', id) {
        return await AJAX_POST(`/container/${type}/${id}/clone`)
    },
    getArgAuth() {
        const isQuoting = localStorage.getItem('isQuoting') && JSON.parse(localStorage.getItem('isQuoting'))
        if(isQuoting) return 'noAuth'
        return false
    }
}