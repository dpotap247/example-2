export const wizardSteps = {
    type: { component: 'type', title: 'Select Type', help_topic_url: 'type', },
    windows_glass_style: { component: 'layout', title: 'Select WINDOW STYLE' },
    layout: { component: 'layout', title: 'Select SLIDING DOOR LAYOUT' },
    size: { component: 'size', title: 'Enter Size', buttons: [
        {
            type: 'outline',
            title: 'NEXT',
            event: 'next',
        }
    ] },
    style: { component: 'layout-price-from', title: 'Select Style', },
    grade: { component: 'layout-price-from', title: 'Select Grade', },
    option: { component: 'option', title: 'Select Option',  buttons: [
        {
            type: 'outline',
            title: 'NEXT',
            event: 'next',
        }
    ]},
    location: { component: 'location', title: 'Select Location', className: 'overflow-hidden'},
    insert_colour: { component: 'color', title: 'Select Insert Color', className: 'overflow-hidden'},
    frame_colour: { component: 'color', title: 'Select Frame Color', className: 'overflow-hidden'},
    all_options: { component: 'all-options', title: 'All Options', buttons: [
        {
            type: 'outline',
            title: 'Save',
            event: 'save',
            icon: 'far fa-save',
            loading: false,
        },
        {
            type: 'outline',
            title: 'Save & Create New',
            event: 'saveNew',
            icon: 'far fa-plus-square',
            loading: false,
        },
        {
            type: 'outline',
            title: 'Save & Clone',
            event: 'saveClone',
            icon: 'far fa-clone ',
            loading: false,
        }
    ]}
}

export const defaultStyleColors = [
    {
        "quoting_portal_id": 1,
        "setting": "PrimaryColour",
        "value": "#0E3753"
    },
    {
        "quoting_portal_id": 1,
        "setting": "PrimaryTextColour",
        "value": "#FFFFFF"
    },
    {
        "quoting_portal_id": 1,
        "setting": "SecondaryColour",
        "value": "#59b692"
    },
    {
        "quoting_portal_id": 1,
        "setting": "SecondaryTextColour",
        "value": "#FFFFFF"
    },
    {
        "quoting_portal_id": 1,
        "setting": "LayoutIconPrimary",
        "value": "#59b692"
    },
    {
        "quoting_portal_id": 1,
        "setting": "LayoutIconSecondary",
        "value": "#777777"
    },
    {
        "quoting_portal_id": 1,
        "setting": "PrimaryButtonColour",
        "value": "#345453"
    },
    {
        "quoting_portal_id": 1,
        "setting": "PrimaryButtonTextColour",
        "value": "#FFFFFF"
    }
]