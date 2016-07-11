$(document).ready(function () {

    /**
     * Go to event page after select from dropdown
     */
    $('#simulate-choose_event').on('change', function (e) {
        var eventId = this.value;
        window.location.href += 'event?id='+eventId;
    });

    /**
     * Show timer
     */
    (function showEventTimer(){
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;

        // Get event start date from a data attribute
        var startDate = $('#event-time').data('startdate');

        // Convert data from MySQL format to JS
        //var t = startDate.split(/[- :]/);
        var start = new Date(startDate);

        function refreshTimer() {
            var now = new Date();

            // Calculate how much time passed since start
            var elapsedTime = now - start;

            var sign = "";
            if(elapsedTime < 0) {
                sign = "-";
                var hours = Math.ceil(elapsedTime / _hour) * -1;
                var minutes = Math.ceil((elapsedTime % _hour) / _minute) * -1;
                var seconds = Math.ceil((elapsedTime % _minute) / _second) * -1;
            }
            else {
                var hours = Math.floor(elapsedTime / _hour);
                var minutes = Math.floor((elapsedTime % _hour) / _minute);
                var seconds = Math.floor((elapsedTime % _minute) / _second);
            }
            // Format time

            $('#event-time').html(sign + formatNumber(hours) + ":" + formatNumber(minutes) + ":" + formatNumber(seconds));
        }

        var timer = setInterval(refreshTimer, 1000);
    })();

    /**
     * Adds additional zero at the beginning if number is 1-digit.
     * @param number
     * @returns {string}
     */
    function formatNumber(number){
        return ("0" + number).slice(-2)
    }

});