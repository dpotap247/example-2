export function search(searchQuery, items, searchOption) {
    const searchLowerCaseText = searchQuery.toLowerCase()
    const filterArray = JSON.parse(JSON.stringify(items))

    if(searchLowerCaseText) {
        filterArray.forEach(el => {
            el.items = el.items.filter(el => {
                const item = searchOption ? el[searchOption] : el
                const searchOption = item.split(' ').join('').toLowerCase()
                if(searchOption.includes(searchLowerCaseText)) return el
            })
        })
    }

    return filterArray
}