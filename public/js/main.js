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


/**
 * SOCKETS
 */

var dataSet = [];

var table = $('#event-data-table').DataTable();


var socket = io();
socket.emit('follow-event', $('#event-id').data('event-id'));

socket.on('refresh', function (data) {

    var $cell = $("td[data-checkpoint-id='" + data.checkpoint_id +"'][data-participant-id='" + data.participant_id +"']");

    var tableCell = table.cell($cell);
    tableCell.data(data.time);
    $cell.addClass('updated');
    tableCell.draw();
    setTimeout(function () {
        $cell.removeClass('updated');
    }, 3000);

});


socket.on('location-update', function (data) {
    markers.forEach(function (marker) {
        if(marker.participant_id == data.participant_id){
            marker.setPosition(new google.maps.LatLng(data.lat, data.lng));
        }
    })
});


/**
 * GOOGLE MAPS
 */

var map;
var markers = {};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
};