import axios from "../libs/axios"

async function AJAX_GET(url, params, noAuth) {
    try {
        let query = ''
        if(params && typeof params === 'object') {
            query += '?'
            for(const key in params) {
                query +=`${key}=${params[key]}`
            }
        }
        const { data } = await axios.get(url + query, setHeader(noAuth))
        return data
    }  catch(err) {
        return err.response?.data || false
    }
}

async function AJAX_DELETE(url, id, noAuth) {
    try {
        const { data } = await axios.delete(url, setHeader(noAuth), id)
        return data
    } catch(err) {
        console.log(err)
        return err.response?.data || false
    }
}

async function AJAX_POST(url, payload, noAuth) {
    try {
        const { data } =  await axios.post(url, payload, setHeader(noAuth))
        return data
    }   catch(err) {
        console.log(err)
        return err.response?.data || false
    }
}

async function AJAX_PUT(url, payload, noAuth) {
    try {
        const { data } = await axios.put(url, payload, setHeader(noAuth))
        return data
    } catch(err) {
        console.log(err)
        return err.response?.data || false
    }
}

function setHeader(noAuth) {
    if(!noAuth) {
        return {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    }
    return {}
}

export { AJAX_GET, AJAX_DELETE, AJAX_POST, AJAX_PUT }