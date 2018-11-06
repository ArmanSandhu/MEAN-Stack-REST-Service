/*
    isValidDate tests a string against a regex to see if its a valid Date.
*/
exports.isValidDate = function(dateString) {
    // This regular expression was created by Asiq Ahamed
    // can be found here https://stackoverflow.com/questions/51224/regular-expression-to-match-valid-dates/8768241
    var dateReg = new RegExp(['^(?:(?:(?:0?[13578]|1[02])(\\/|-|\\.)31)', 
    '\\1|(?:(?:0?[1,3-9]|1[0-2])(\\/|-|\\.)(?:29|30)', 
    '\\2))(?:(?:1[6-9]|[2-9]\\d)?\d{2})$|^(?:0?2(\\/|-|\\.)', 
    '29\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|', 
    '[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))', 
    '$|^(?:(?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.)', 
    '(?:0?[1-9]|1\\d|2[0-8])\\4', '(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$'].join(''),"g");

    return dateReg.test(dateString);
}

/*
    isValidHour tests a String against a regex to see if its a valid Time.
*/
exports.isValidHour = function(hourString) {
    var hourReg =  /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;

    return hourReg.test(hourString);
}

/*
    parseDateHour takes 2 Strings and return a Date Object. The 2 Strings should already be formatted.
*/
exports.parseDateHour = function(dateString, hourString) {
    // Regex patterns for Time
    var dateReg = /[.\/-]/;
    var hourReg = /[: ]/;

    // Split the date and hour strings based on the regex patterns
    var date = dateString.split(dateReg);
    var hour = hourString.split(hourReg);

    if(hour[0] == "12" && hour[2].toLowerCase() == "am"){
        // The hour string is 12:XX AM
        return new Date(Date.UTC(Number(date[2]), Number(date[0])-1, Number(date[1]), 0, Number(hour[1])));
    } else if(!(hour[0] == "12") && hour[2].toLowerCase() == "pm") {
        // The hour string is greater than 12:XX PM
        return new Date(Date.UTC(Number(date[2]), Number(date[0])-1, Number(date[1]), Number(hour[0]) + 12, Number(hour[1])));
    } else {
        return new Date(Date.UTC(Number(date[2]), Number(date[0])-1, Number(date[1]), Number(hour[0]), Number(hour[1])));
    }
}

/*
    isWithinCurrentWeek checks if the Events Start Date falls within the current week.
*/
exports.isWithinCurrentWeek = function(startDate) {
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    var first = now.getDate() - now.getDay();
    var first = first + 1;
    var last = first + 6;
    
    var monday = new Date(now.setDate(first));
    var sunday = new Date(now.setDate(last));
    sunday.setHours(23);
    sunday.setMinutes(59);
    sunday.setSeconds(59);

    if(startDate >= monday && startDate <= sunday ){
        return true;
    } else {
        return false;
    }
}