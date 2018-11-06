$(document).ready(function(){

    // Call function on page ready
    addToInput();

    /*
        When a Event is selected, call the function to update form placeholders
    */
    $('#event').change(function (){
        addToInput();
    });

    /*
        Function to modify the Update Form to show the current properties of the Event.
    */
    function addToInput(){
        // Grab the Event from the dropdown
        var str = ($('#event option:selected').text()).split(/ - /);
        $('#eventID').val(str[1]);

        // AJAX call to retrieve Event data
        $.ajax({
            type: "GET",
            url: "/events/update/" + str[1]
        }).done(function(data){
            data = $.parseJSON(data);
            var dateString = parseDate(data.startDate);
            var startTime = parseTime(data.startDate);
            var endTime = parseTime(data.endDate);
            $('#eventDate').attr('placeholder', dateString);
            $('#eventStart').attr('placeholder', startTime);
            $('#eventEnd').attr('placeholder', endTime);
            if (data.isActive){
                $('#radio_active').attr('checked', true);
            } else {
                $('#radio_inactive').attr('checked', true);
            }
        }).fail(function(){
            alert("Error Retrieving Event!");
        }).always();
    }

    /*
        Utility Function to Parse Date. Date is passed as variable and a String is returned in the format mm/dd/yyyy
    */
    function parseDate(date){
        var myDate = new Date(date);
        return (((myDate.getUTCMonth()+1).toString().length === 1) ? "0" 
        + (myDate.getUTCMonth()+1) : (myDate.getUTCMonth()+1) ) + "/" 
        + (((myDate.getUTCDate()).toString().length === 1) ? "0" + myDate.getUTCDate() : myDate.getUTCDate()) + "/" + myDate.getUTCFullYear();
    }

    /* 
        Utility Function to Parse Time. Date is passed as variable and a String is returned in the format X:XX AM/PM
    */
    function parseTime(time){
        var myTime = new Date(time);
        return ((myTime.getUTCHours() === 0) ?  myTime.getUTCHours() + 12 : (myTime.getUTCHours() > 12) ? myTime.getUTCHours() - 12 : myTime.getUTCHours()) 
        + ":" + (((myTime.getUTCMinutes()).toString().length === 1) ? "0" + myTime.getUTCMinutes() : myTime.getUTCMinutes()) 
        + " " + ((myTime.getUTCHours() >= 12) ? "PM" : "AM");
    }
});