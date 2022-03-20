function setField(state, { field, value }) {
    if (!field) return
    state[field] = value
}

function setFieldObj(state, { field, subField, value }) {
    if (!field || !subField) return
    state[field][subField] = value
}

export { setField, setFieldObj }