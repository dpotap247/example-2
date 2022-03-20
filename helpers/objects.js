export function getValueFromObject(data) {
    let value = {}
    if(Array.isArray(data)) {
        data.forEach(el => {
            if(el.disabled) return
            if(Array.isArray(el.key)) {
                const firstKey = el.key[0]
                const secondKey = el.key[1]

                if(!value[firstKey]) value[firstKey] = {}

                value[firstKey][secondKey] = el.value
            } else value[el.key] = el.value
        })
    } else if(typeof data == 'object') {
        for(const key in data) {
            if(data[key].disabled) return
            value[key] = data[key].value
        }
    }
    return value
}


export function getErrorFromServer(data = {}) {
    let value = {
        type: 'error',
        title: data.message || data.error ||'Error',
        text: '',
    }

    const { errors } = data
    if(errors) {
        for(const key in errors) {
            value.text += `${errors[key]}<br>`
        }
    } else value.text = !data.error ? 'Something went wrong' : ''

    return value
}

export function getValidationError(errors = {}, data) {
    if(Array.isArray(data)) {
        data.forEach(el => {
            let errorsKey = ''

            if(Array.isArray(el.key)) {
                const firstKey = el.key[0]
                const secondKey = el.key[1]
                errorsKey = `${firstKey}.${secondKey}`
            } else errorsKey = el.key

            if(errors[errorsKey]) el.error = errors[errorsKey][0]
        })
    } else {
        for(const key in errors) {
            const item = data[key]
            item.error = errors[key][0]
        }
    }
    return data
}

export function checkValidation(inputs, values) {
    let isError = false
    for(const key in inputs) {
        if(inputs[key].required && !values[key]) {
            inputs[key].error = 'This field required'
            if(!isError) isError = true
        }
    }
    return isError
}

export function clearValidationError(data, key) {
    if(Array.isArray(data)) {
        if(key) {
            const item = data.find(el => el.key == key)
            item.error = ''
            return
        } 
        data.forEach(el => {
            if(el.error) el.error = ''
        }) 
    } else {
        if(key) {
            data[key].error = ''
            return
        } 
        for(const key in data) {
            data[key].error = ''
        }
    }
    return data
}


export function numberFilter(number) {
    return number.split('').filter(el => el !== '-').join('')
}

export function sortItems(items, key) {
    const array = !Array.isArray(array) ? Object.entries(items) : items
    return array.sort(( a, b ) => a[key] - b[key])
}