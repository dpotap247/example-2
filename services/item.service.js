import { AJAX_DELETE, AJAX_GET, AJAX_POST } from '../helpers/ajax'
import router from '@/router'

export default {
    
    async getData(id, platformType, type = '') {
        let url = `${this.getContainer()}/${platformType}/${id}`
        if(type) url += `/${type}`
        return await AJAX_GET(url)
    },
    async getSummary(id, type) {
        return await AJAX_GET(`${this.getContainer()}/${type}/${id}/locations`)
    },
    async getLocationItems(id, type, location) {
        return await AJAX_GET(`${this.getContainer()}/${type}/${id}/location-items/${location}`)
    },
    async getItemAcessories(id, type) {
        return await AJAX_GET(`${this.getContainer()}/${type}/item/${id}/accessories`)
    },
    async setSortLocations(id, type, payload) {
        return await AJAX_POST(`${this.getContainer()}/${type}/${id}/sort`, payload)
    },
    async getSpecification(id = 9155) {
        return await AJAX_GET(`${this.getContainer()}/${id}/specification`)
    },
    async removeItem(type = 'position', id) {
        return await AJAX_DELETE(`${this.getContainer()}/${type}/${id}/delete`)
    },
    getContainer() {
        const route = router.options.history.location
        if(route.includes('orders') || route.includes('job')) return ''
        return '/container'
    }
}