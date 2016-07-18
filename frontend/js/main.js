$(document).ready(function () {

    const eventId = $('#event-id').data('event-id');

    // Format start date of the event
    const eventStartDate = $('#event_start_date').text();
    $('#event_start_date').text(moment(eventStartDate).format('Do MMMM YYYY, HH:mm:ss'));

    /**
     * Create new map
     */
    let markers = {};
    const map = L.map('map');
    const service = new L.tileLayer('https://api.mapbox.com/styles/v1/krisu/ciqpgxyy0003wcankixy95bud/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3UiLCJhIjoiY2lxcGd5enllMDA2MGh5bWFrYnA0Z2hwMiJ9.4j9N70VORhhTh1eUOSjL3A', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);

    // Profile of the track
    const el = L.control.elevation({
        theme: "steelblue-theme",
        width: 600,
        height: 100,
        margins: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    });
    el.addTo(map);

    // Add track to the map
    const gpx = 'trasa.gpx'; // URL to your GPX file or the GPX itself
    const g = new L.GPX(gpx, {
        async: true,
        marker_options: {
            startIconUrl: '../images/pin-icon-start.png',
            endIconUrl: '../images/pin-icon-end.png',
            shadowUrl: '../images/pin-shadow.png'
        }
    });
    g.on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
    });
    g.on("addline",function(e){
        el.addData(e.line);
    });
    g.addTo(map);
    map.addLayer(service);


    /**
     * Tables with data
     */
    const $generalTable = $('#event-data-table');
    const generalTable = $generalTable.DataTable({
        "dom": '<<"general-table-top"lf><t><"general-table-bottom"ip>>'
    });
    const followingTable = $('#following-data-table');


    /**
     * SOCKETS
     */

    // Create new connection
    const socket = io();

    /**
     * Subscribe to event updates
     */
    socket.on('connect', function(){
        socket.emit('follow-event', eventId);
    });

    /**
     * Checkpoint refresh, update time in tables
     */
    socket.on('refresh', function (data) {
        const generalTableCell = $('#event-data-table').find("td[data-checkpoint-id='" + data.checkpoint_id +"'][data-participant-id='" + data.participant_id +"']").eq(0);
        const followingTableCell = $('#following-data-table').find("td[data-checkpoint-id='" + data.checkpoint_id +"'][data-participant-id='" + data.participant_id +"']").eq(0);

        // Update time in general table
        if(generalTableCell.length > 0) {
            let tableCell = generalTable.cell(generalTableCell);
            tableCell.data(data.time);
            generalTableCell.addClass('updated');
            tableCell.draw();
            setTimeout(function () {
                generalTableCell.removeClass('updated');
            }, 3000);
        }

        // Update time in following table
        if(followingTableCell.length > 0) {
            followingTableCell.text(data.time);
            followingTableCell.addClass('updated');
            setTimeout(function () {
                followingTableCell.removeClass('updated');
            }, 3000);
        }
    });

    /**
     * Location update from mobile, refresh marker on the map
     */
    socket.on('location-update', function (data) {
        const marker = markers[data.participant_event_id];
        if(marker){
            if(marker.getLatLng().equals(L.latLng(0,0))){
                marker.addTo(map);
            }
            marker.setLatLng(L.latLng(data.lat, data.lng));
        }
    });

    /**
     * FOLLOW & UNFOLLOW
     */
    $generalTable
        .on('click', 'span.follow', function () {
            // Get participant id, hide button Follow and show button Unfollow
            const id = $(this).parents('tr').data('participant-event-id');
            $(this).hide();
            $(this).siblings('.unfollow').show();

            // Subscribe to location updates of the selected participant
            socket.emit('follow-participant', id);

            // Get participant's name
            const participantName = $(this).parent().siblings('.participant_name').text();

            // Create marker on the map
            markers[id] = L.marker([0, 0])
                .bindLabel(`${participantName}`, {
                    noHide: true,
                    direction: 'auto'
                });

            // Copy row to Following table
            const row = $(this).parents('tr').clone();
            let cells = row.children('td');

            // Remove Category, Team, City and Location columns
            cells.splice(1,3);
            cells.splice(cells.length - 1, 1);
            followingTable.children('tbody').append('<tr data-participant-event-id="' + id + '">');
            followingTable.children('tbody').children('tr:last').append(cells);

            addToSessionStorage(id);
        })
        .on('click', 'span.unfollow', function () {
            const id = $(this).parents('tr').data('participant-event-id');
            $(this).hide();
            $(this).siblings('.follow').show();
            socket.emit('unfollow-participant', id);
            delete markers[id];

            // Remove row from Following table
            followingTable.find('tr[data-participant-event-id="'+id+'"]').remove();

            removeFromSessionStorage(id);
        });

    /**
     * Session storage - store ids of followed participants
     */
    function addToSessionStorage(participantId){
        let following = JSON.parse(sessionStorage.getItem(eventId));
        if(!following){
            following = {};
        }
        following[participantId] = true;
        sessionStorage.setItem(eventId, JSON.stringify(following));
    }
    function removeFromSessionStorage(participantId){
        let following = JSON.parse(sessionStorage.getItem(eventId));
        if(following && following[participantId]){
            delete following[participantId];
        }
        sessionStorage.setItem(eventId, JSON.stringify(following));
    }
    (function restoreFollowings(){
        const following = JSON.parse(sessionStorage.getItem(eventId));
        for (const participantId in following) {
            $generalTable
                .find('tr[data-participant-event-id="'+participantId+'"]')
                .find('span.follow')
                .trigger('click');
        }
    })();



    /**
     * Show timer
     */
    (function showEventTimer(){
        const _second = 1000;
        const _minute = _second * 60;
        const _hour = _minute * 60;

        // Get event start date from a data attribute
        const startDate = $('#event-time').data('startdate');

        // Convert data from MySQL format to JS
        //var t = startDate.split(/[- :]/);
        const start = new Date(startDate);

        const refreshTimer = () => {
            const now = new Date();

            // Calculate how much time passed since start
            const elapsedTime = now - start;

            let sign = "", hours, minutes, seconds;
            if(elapsedTime < 0) {
                sign = "-";
                hours = Math.ceil(elapsedTime / _hour) * -1;
                minutes = Math.ceil((elapsedTime % _hour) / _minute) * -1;
                seconds = Math.ceil((elapsedTime % _minute) / _second) * -1;
            }
            else {
                hours = Math.floor(elapsedTime / _hour);
                minutes = Math.floor((elapsedTime % _hour) / _minute);
                seconds = Math.floor((elapsedTime % _minute) / _second);
            }
            // Format time

            $('#event-time').html(sign + formatNumber(hours) + ":" + formatNumber(minutes) + ":" + formatNumber(seconds));
        };

        setInterval(refreshTimer, 1000);
    })();

    /**
     * Adds additional zero at the beginning if number is 1-digit.
     */
    const formatNumber = (number) => {
        return ("0" + number).slice(-2)
    }

});