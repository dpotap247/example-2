import moment from 'moment'

export function useFormatter() {
    function formatMoney(value) {
        if (value){
            const val = (value/1).toFixed(2).replace(',', '.')
            return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        return '$0.00'
    }

    function formatDate(date, format = 'DD.MM.YYYY') {
        return moment(date).format(format)
    }

    return {
        formatMoney,
        formatDate
    }
}