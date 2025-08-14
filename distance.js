var key;

var oldsessionID;
var totalDistance = 0.0;
var gps = { old: { latitude: 0.0, longitude: 0.0 }, new: { latitude: 0.0, longitude: 0.0 } };


// Get user options
var params = new URLSearchParams(window.location.search);
key = params.get('key') || '';

RealtimeIRL.forPullKey(key).addLocationListener(
   function ({ latitude, longitude }) {
      gps.new.latitude = latitude;
      gps.new.longitude = longitude;

      if (oldsessionID === undefined) {
         document.getElementById("text").innerText = '0.0' + unit;
      } else {
         // We have new gps points. Let's calculate the delta distance using previously saved gps points.
         delta = distanceInKmBetweenEarthCoordinates(gps.new.latitude, gps.new.longitude, gps.old.latitude, gps.old.longitude);
         totalDistance = totalDistance + delta;
         totalStr = (totalDistance * unitMultiplier).toFixed(1) + unit;
         document.getElementById("text").innerText = totalStr;
         //shifting new points to old for next update
         gps.old.latitude = latitude;
         gps.old.longitude = longitude;

         // Note that because of GPS drift, different gps points will keep comming even if 
         // the subject is stationary. Each new gps point will be considered as subject is moving 
         // and it will get added to the total distance. Each addition will be tiny but it will  
         // addup over time and can become visible. So, at the end the shown distance might look 
         // sligtly more than expected.
      }
   }
);

RealtimeIRL.forPullKey(key).addSessionIdListener(
   function (sessionId) {
      if (sessionId != oldsessionID) {
         oldsessionID = sessionId;
         resetVars();
      }
   }
);

function degreesToRadians(degrees) {
   return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
   var earthRadiusKm = 6371;

   var dLat = degreesToRadians(lat2 - lat1);
   var dLon = degreesToRadians(lon2 - lon1);

   lat1 = degreesToRadians(lat1);
   lat2 = degreesToRadians(lat2);

   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return earthRadiusKm * c;
}

function resetVars() {
   // New session. Reset total distance
   totalDistance = 0;
   // Set starting point to the current point
   gps.old.latitude  = gps.new.latitude;
   gps.old.longitude = gps.new.longitude;
}
