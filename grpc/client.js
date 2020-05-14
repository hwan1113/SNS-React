const grpcRoutepkg = require('./index')
const grpc = require('grpc');
const _ = require('lodash');
var async = require('async');
var COORD_FACTOR = 1e7;
const client = new grpcRoutepkg.grpcRoute('13.124.64.181:58599',
  grpc.credentials.createInsecure());




function runGetFeature(callback) {
  // calls next function only after it is called twice;
  var next = _.after(2, callback);
  function featureCallback(error, feature) {
    if (error) {
      callback(error);
      return;
    }
    if (feature.name === '') {
      console.log('Found no feature at ' +
        feature.location.latitude / COORD_FACTOR + ', ' +
        feature.location.longitude / COORD_FACTOR);
    } else {
      console.log('Found feature called "' + feature.name + '" at ' +
        feature.location.latitude / COORD_FACTOR + ', ' +
        feature.location.longitude / COORD_FACTOR);
    }
    next();
  }

  var point1 = {
    latitude: 409146138,
    longitude: -746188906
  };
  var point2 = {
    latitude: 0,
    longitude: 0
  };
  client.getFeature(point1, featureCallback);
  client.getFeature(point2, featureCallback);
}

//A server-to-client streaming RPC
function runListFeatures(callback) {
  var rectangle = {
    lo: {
      latitude: 410000000,
      longitude: -750000000
    },
    hi: {
      latitude: 420000000,
      longitude: -730000000
    }
  };
  console.log('Looking for features between 40, -75 and 42, -73');
  var call = client.listFeatures(rectangle);
  call.on('data', function (feature) {
    console.log('Found feature called "' + feature.name + '" at ' +
      feature.location.latitude / COORD_FACTOR + ', ' +
      feature.location.longitude / COORD_FACTOR);
  });
  call.on('end', callback);
}

// client-to-server streaming RPC.
function runRecordRoute(callback) {
  var num_points = 10;
  var call = client.recordRoute(function (error, stats) {
    if (error) {
      callback(error);
      return;
    }
    console.log('Finished trip with', stats.point_count, 'points');
    console.log('Passed', stats.feature_count, 'features');
    console.log('Travelled', stats.distance, 'meters');
    console.log('It took', stats.elapsed_time, 'seconds');
    callback();
  });

  var feature_list = [{
    "location": {
      "latitude": 407838351,
      "longitude": -746143763
    },
    "name": "Patriots Path, Mendham, NJ 07945, USA"
  }, {
    "location": {
      "latitude": 408122808,
      "longitude": -743999179
    },
    "name": "101 New Jersey 10, Whippany, NJ 07981, USA"
  }, {
    "location": {
      "latitude": 413628156,
      "longitude": -749015468
    },
    "name": "U.S. 6, Shohola, PA 18458, USA"
  }]
  function pointSender(lat, lng) {
    return function (callback) {
      console.log('Visiting point ' + lat / COORD_FACTOR + ', ' +
        lng / COORD_FACTOR);
      call.write({
        latitude: lat,
        longitude: lng
      });
      _.delay(callback, _.random(500, 1500));
    };
  }
  var point_senders = [];
  for (var i = 0; i < num_points; i++) {
    var rand_point = feature_list[_.random(0, feature_list.length - 1)];
    point_senders[i] = pointSender(rand_point.location.latitude,
      rand_point.location.longitude);
  }
  async.series(point_senders, function () {
    call.end();
  });

}

function runRouteChat(callback) {
  var call = client.routeChat();
  call.on('data', function (note) {
    console.log('Got message "' + note.message + '" at ' +
      note.location.latitude + ', ' + note.location.longitude);
  });

  call.on('end', callback);

  var notes = [{
    location: {
      latitude: 0,
      longitude: 0
    },
    message: 'First message'
  }, {
    location: {
      latitude: 0,
      longitude: 1
    },
    message: 'Second message'
  }, {
    location: {
      latitude: 1,
      longitude: 0
    },
    message: 'Third message'
  }, {
    location: {
      latitude: 0,
      longitude: 0
    },
    message: 'Fourth message'
  }];
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    console.log('Sending message "' + note.message + '" at ' +
      note.location.latitude + ', ' + note.location.longitude);
    call.write(note);
  }
  call.end();
}

function main() {
  async.series([
    runGetFeature,
    runListFeatures,
    runRecordRoute,
    runRouteChat
  ]);
};
main();

exports.runGetFeature = runGetFeature;
exports.runListFeatures = runListFeatures;
exports.runRecordRoute = runRecordRoute;
exports.runRouteChat = runRouteChat;