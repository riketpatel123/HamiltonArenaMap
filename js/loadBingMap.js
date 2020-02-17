// I, Riket Patel, student number 000730183, certify that all code submitted is my own work; that I have not copied it from any other source.  I also certify that I have not allowed my work to be copied by others.

var map , infobox, pushpin , currentlocation, parkingmap, myloc;
var infoboxTemplate = '<div class="customInfobox"><div class="title">{title}</div>{description}</div>';

function loadMap() {
    // loading Bing Map
    var navigationBarMode = Microsoft.Maps.NavigationBarMode;
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {navigationBarMode: navigationBarMode.compact,});
    //Create an infobox, but don't show it.
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), { visible: false });
    //Assign the infobox to a map instance.
    infobox.setMap(map);
    // get Current Location of the user
    navigator.geolocation.getCurrentPosition(function (position) {
        myloc = new Microsoft.Maps.Location(
            position.coords.latitude,
            position.coords.longitude);
            // Add pushpin to the current location of the user
            currentlocation = new Microsoft.Maps.Pushpin(myloc, {
                color:'red',
                anchor:  new Microsoft.Maps.Point(15,20)
            });
            Microsoft.Maps.Events.addHandler(currentlocation, 'click', function(e) {
                // Set current location inforbox
                infobox.setOptions({
                    location: e.target.getLocation(),
                    title: 'Current Location',
                    description: 'This is your Current location',
                    visible: true
                });
            });
            //Add pushpin to the map
            currentlocation.setOptions({ enableHoverStyle: true});
            //show traffic layer
            Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', function () {
                var manager = new Microsoft.Maps.Traffic.TrafficManager(map);
                manager.show();
            });
            map.entities.push(currentlocation);
            addpushpins();
            parkingPushpins();
            $("#warningPanel").addClass("bg-success rounded-circle text-dark mr-4 mb-0 p-2 ");
        },
        // function to handle error
        function(error){
            var errorMessage;
            switch(error.code){
                case error.PERMISSION_DENIED:
                errorMessage="PERMISSION_DENIED: Reload Page"
                break;
                case error.POSITION_UNAVAILABLE:
                errorMessage="Location information is unavailable."
                break;
                case error.TIMEOUT:
                errorMessage="TIMEOUT: Please Try Again!"
                break;
                case error.UNKNOWN_ERROR:
                errorMessage="UNKNOWN_ERRor OCCURED!"
                break;
            }
            $("#warningPanel").addClass('bg-warning text-dark mr-4 mb-0 pr-3 pl-3').html("GPS Location Not Found [" + errorMessage + " ]" );
        });
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
            var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
            directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('printoutPanel') });
            directionsManager.showInputPanel('directionsInputContainer');
            $('#clearDirection').on('click', function(){
                    directionsManager.clearDisplay();
                    directionsManager.showInputPanel('directionsInputContainer');
            });
        });

    }
    // add arena pushpin
    function addpushpins(){
        map.entities.push(currentlocation);
        for (i in arenaList){
            var pushpinLocation = new Microsoft.Maps.Location(
                arenaList[i].latitude,
                arenaList[i].longitude);
                pushpin = new Microsoft.Maps.Pushpin(pushpinLocation,{
                    icon:'images/arenaPushpin.png',
                    anchor:  new Microsoft.Maps.Point(15,20)});
                    //Store some metadata with the pushpin.
                    pushpin.metadata = {
                        title: arenaList[i].name,
                        description: arenaList[i].address + ", " + arenaList[i].community,
                        phone: arenaList[i].phone,
                        website: arenaList[i].website
                    };

                    function setInfoboxOptions(component){
                        if (component.target.metadata) {
                            infobox.setOptions({
                                location: component.target.getLocation(),
                                title: component.target.metadata.title,
                                description: 'Address: ' + component.target.metadata.description,
                                visible: true
                            });
                            infobox.metadata = {
                                title: component.target.metadata.title,
                                description:component.target.metadata.description,
                                phone:component.target.metadata.phone,
                                website:component.target.metadata.website
                            };
                            Microsoft.Maps.Events.addHandler(infobox, 'click', function (component) {
                                if (component.target.metadata) {
                                    $('#sidebar').addClass('active');
                                    $("div").removeAttr("data-draggable");
                                    $('#nameInfo').html(component.target.metadata.title);
                                    $('#addressInfo').html(component.target.metadata.description);
                                    $('#phoneInfo').html(component.target.metadata.phone);
                                    $('#webinfo').html(component.target.metadata.website);
                                    $('#webinfo').attr('href',component.target.metadata.website);
                                    $("#directionsInputContainer > div > div > div.directionsInput > div.dirWaypoints > div > div > div:nth-child(1) > div > div.dirWp > input[type='text']").val("");
                                    $("#directionsInputContainer > div > div > div.directionsInput > div.dirWaypoints > div > div > div:nth-child(2) > div > div.dirWp > input[type='text']").val(component.target.metadata.description);
                                }
                            });
                        }
                    }
                    Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', function(e) {
                        setInfoboxOptions(e);
                    });
                    Microsoft.Maps.Events.addHandler(pushpin, 'click', function(e) {
                        setInfoboxOptions(e);
                    });
                    Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', function(e) {
                        if (e.target.metadata) {
                            infobox.setOptions({
                                location: e.target.getLocation(),
                                visible: false
                            });
                        }
                    });
                    pushpin.setOptions({ enableHoverStyle: true, enableClickedStyle: true });
                    //Add pushpin to the map.
                    map.entities.push(pushpin);
                }
            }
            function parkingPushpins(){
                var parkingPushpin , paringInfobox;
                paringInfobox = new Microsoft.Maps.Infobox(map.getCenter(), { visible: false });
                for (i in parkingList ){
                    var pushpinLocation = new Microsoft.Maps.Location(
                        parkingList[i].latitude,
                        parkingList[i].longitude);
                        parkingPushpin = new Microsoft.Maps.Pushpin(pushpinLocation,{
                            icon:'images/parkingSpot.png',
                            anchor:  new Microsoft.Maps.Point(12,12)});
                            //Store some metadata with the pushpin.
                            parkingPushpin.metadata = {
                                title: parkingList[i].location,
                                address: parkingList[i].address,
                                owner: parkingList[i].owner
                            };
                            function setInfoboxOptions(component){
                                if (component.target.metadata) {
                                    paringInfobox.setOptions({
                                        location: component.target.getLocation(),
                                        title: component.target.metadata.title,
                                        description: "<i class='fas fa-parking fa-lg' style='width:20px;height:20px;color: Mediumslateblue;'></i> Address: " + component.target.metadata.address + ', Owner: '+ component.target.metadata.owner,
                                        visible: true
                                    });
                                    paringInfobox.metadata = {
                                        location: component.target.metadata.title,
                                        address:component.target.metadata.address,
                                        owner:component.target.metadata.owner
                                    };
                                    Microsoft.Maps.Events.addHandler(paringInfobox, 'click', function (component) {
                                        if (component.target.metadata) {
                                            $('#sidebar').addClass('active');
                                            $("div").removeAttr("data-draggable");
                                            $('#parkingLocation').html(component.target.metadata.location);
                                            $('#parkingAddress').html(component.target.metadata.address);
                                            $('#parkingOwner').html(component.target.metadata.owner);
                                        }
                                    });
                                }
                            }
                            Microsoft.Maps.Events.addHandler(parkingPushpin, 'mouseover', function(e) {
                                setInfoboxOptions(e);
                            });
                            Microsoft.Maps.Events.addHandler(parkingPushpin, 'click', function(e) {
                                setInfoboxOptions(e);
                            });
                            Microsoft.Maps.Events.addHandler(parkingPushpin, 'mouseout', function(e) {
                                if (e.target.metadata) {
                                    paringInfobox.setOptions({
                                        location: e.target.getLocation(),
                                        visible: false
                                    });
                                }
                            });
                            parkingPushpin.setOptions({ enableHoverStyle: true, enableClickedStyle: true });
                            //Add pushpin to the map.
                            map.entities.push(parkingPushpin);
                            paringInfobox.setMap(map);
                        }
                    }
