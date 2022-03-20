import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export function useOptionLogic(props) {
        const store = useStore()

        const layoutAppliesTo = props.items && props.items.appliesTo == 'layout'
        const currentKeyForValues = computed(() => `value_${props.currentSection}`)
        
        // if(props.items) getPrice()
        function getData(options, values, groupName = 'default') {
            //key for ui object
            const valuesKey = currentKeyForValues.value 
            // set object item 
            if(!values.value[valuesKey]) values.value[valuesKey] = 0    
            const choices = getChoices(groupName)
            // first get options for ui 
            if(!options.value) {
                options.value = choices && choices.map(el => {
                    return {
                        label: el.name,
                        value: el.id  || el.name,
                        key: el.name,
                        disabled: false,
                        ...el,
                    }
                })
            }
            if(!choices) return
            // set selected to ui object 
            const selected = getDefaultItem(choices)
            if(selected)  values.value[valuesKey] = selected.id || selected.name
        }
    

        function selectItem(selectedId, groupName = 'default') {
            const sections = props.items.sections
            //if appliesTo == 'layout' set value for all item
            if(layoutAppliesTo) {
                sections.forEach((item, index) => {
                    selectLogic(item, selectedId, groupName, index)
                })
            } else {
                //set value for current section
                const currentSection = props.currentSection
                const item = sections[currentSection]
                selectLogic(item, selectedId, groupName, currentSection)
            }
        }

        function layoutAppliesToLogic() {
            const sections = props.items.sections

            console.log(sections)
        }

        function selectLogic(sectionItem, selectedId, groupName, indexCurrentSection) {
            const choices = getChoices(groupName, sectionItem)
            //get selected item
            const selectedValue = choices.find(el => el.id == selectedId || el.name == selectedId)

            //get last selected item and remove
            const lastSelectedValue = choices.find(el => el.default)
            if(lastSelectedValue) delete lastSelectedValue.default
            
            //set value for selected value
            selectedValue.default = true
            //set price to currentSection
            getPrice(indexCurrentSection)
        }

        function getChoices(groupName, sectionItem) {
            const sectionIndex = layoutAppliesTo ? 0 : props.currentSection 
            const section = sectionItem || props.items.sections[sectionIndex]
            const option = section.options[props.items.optionName]
            const group = option.option_settings?.groups.find(el => el.name == groupName) || {}
            return group.choices
        }

        function getPrice(data) {
            const sectionsPrice = store.state.wizard.price || []
            const index = !Array.isArray(data) && data
            const sections = props.items && props.items.sections || data

            if(index === 0 || index) {
                const optionName = props.items.optionName
                const optionCode = props.items.optionCode
                //get current option
                const option = sections[index].options[optionName]
                //set price only for current section/optionName
                sectionsPrice[index][optionCode] = sumGroupsItem(optionCode, option)
            } else {
                // store.commit('wizard/setField', { field: 'price', value: sectionsPrice})
                store.commit('wizard/setField', { field: 'price', value: null})
                // in all section in all groups sum defaults item
                sections.forEach((section, index) => {
                    if(!sectionsPrice[index]) sectionsPrice.push({})
                    for(const key in section.options) {
                        const option = section.options[key]
                        const optionCode = option.option_code
                        sectionsPrice[index][optionCode] = sumGroupsItem(optionCode, option)
                    }
                })
            }
            console.log(sectionsPrice, 'sectionsPrice')
            store.commit('wizard/setField', { field: 'price', value: sectionsPrice})
        }


        function sumGroupsItem(optionCode, option) {
            let sum = 0

            const settings = option.option_settings
            if(!settings) return sum

            const groups = settings.groups || settings.values
            const choice_price = settings.choice_price

            switch(optionCode) {
                case 'LFTT':
                case 'PSHP': {
                    const qty =  Object.keys(settings.settings).filter(el => settings.settings[el] == true).length
                    sum += qty * choice_price
                    break
                }
                case 'PRTS':
                case 'HOPH': {
                    const qty = settings.choices.filter(el => el.selected).length
                    sum += qty * choice_price

                    break
                }
                case 'ADD': {
                    groups.forEach((group) => {
                        group.choices.forEach(el => {
                            sum += el.default && el.price || 0
                        })
                    })
                    break
                }
                case 'HNG': {
                    if(!groups) break
                    const groupHingeType = groups.find(el => el.name == 'hinge_type')
                    const groupHingeQTY = groups.find(el => el.name == 'hinge_qty')
                    
                    //default item hinge type
                    const defaultItemGroupHingeType = getDefaultItem(groupHingeType.choices)
                    //default item hinge qty
                    const defaultItemGroupHingeQTY = getDefaultItem(groupHingeQTY.choices)

                    //get count '1 hinges'
                    const countHingeQTY = defaultItemGroupHingeQTY && defaultItemGroupHingeQTY.components[0].qty || 1
                    //hinge type item * count hinge qty
                    sum += defaultItemGroupHingeType.price * parseInt(countHingeQTY)
                    break
                }
                case 'MIDR':
                case 'MULL': {
                    if(!groups) break
                    const selectedItems = groups.filter(el => el.selected)
                    if(selectedItems) {
                        selectedItems.forEach(el => {
                            sum += el.choice_price
                        })
                    }
                    break
                }
                default: {
                    if(!groups) break
                    groups.forEach(group => {
                        const defaultItem = getDefaultItem(group.choices)
                        if(defaultItem) sum += defaultItem.price || defaultItem.choice_price || 0
                    })
                }
            }
            
            return sum
        }

        function selectColor(colorId, currentItem, groupName) {
            const section = props.items.sections[props.currentSection]
            const choices = getChoices(groupName, section)
            console.log('groupName', groupName, currentItem, choices)
            const item = choices.find(el => el.id == currentItem || el.name == currentItem)
            if(item) item.colour = colorId
        }

        function getColorGroup(groupName) {
            const currentChoices = getChoices(groupName)
            const defaultItem = getDefaultItem(currentChoices)
            return defaultItem?.colour_group
        }

        function getDefaultItem(choices) {
            if(!choices) return 
            let item = choices.find(el => el.default || el.selected)
            if(!item) item = choices.find(el => el.is_default || el.is_selected)
            return item
        }
    

        return {
            layoutAppliesTo,
            getData,
            selectItem,
            currentKeyForValues,
            getPrice,
            selectColor,
            getColorGroup
        }
}
