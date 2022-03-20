export function useLimitsLogic(props) {

    function getDisabledValue(limits) {
        const sections = props.allData.steps.find(step => step.name == 'Size').data.sections
        //set disabled limits
        let value = false
        if(limits) {
            const { drop_max, drop_min, width_max, width_min } = Array.isArray(limits) && limits[0] || limits
            let i = 0
            const sectionsCount = sections.length
            while(i < sectionsCount) {
                
                if(value) break
                const section = sections[i]
                const sectionWidth = parseInt(section.width)
                const sectionDrop = parseInt(section.drop)

                if( parseInt(drop_max) < sectionDrop 
                    || parseInt(drop_min) > sectionDrop 
                    || parseInt(width_max) < sectionWidth 
                    || parseInt(width_min) > sectionWidth ) value = true

                i += 1
            }
        }
        return value
    }

    return {
        getDisabledValue
    }
}