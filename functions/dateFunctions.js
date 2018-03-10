const getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
}
module.exports = {
    getDate: function (offset) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        let maxDays = getDaysInMonth(today.getMonth() + 1, today.getFullYear());
        if (offset) {
            if (dd + offset > maxDays) {
                dd = dd + offset - maxDays;
                mm++;

            } else {
                dd = dd + offset;
            }
        }
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = mm + '-' + dd + '-' + yyyy;
        return today;
    }
};