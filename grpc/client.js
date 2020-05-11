const grpcRoutepkg = require('./index')
const grpc = require('grpc');
const _ = require('lodash');
var COORD_FACTOR = 1e7;
const client = new grpcRoutepkg.grpcRoute('52.78.41.128:58833', grpc.credentials.createInsecure());
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
function featureCallback(error, feature) {
    if (error) {
    //   callback(error);
      return;
    }
    if (feature.name === '') {
      console.log('Found no feature at ' +
          feature.location.latitude/COORD_FACTOR + ', ' +
          feature.location.longitude/COORD_FACTOR);
    } else {
      console.log('Found feature called "' + feature.name + '" at ' +
          feature.location.latitude/COORD_FACTOR + ', ' +
          feature.location.longitude/COORD_FACTOR);
    }
}
var rectangle = {
    lo: {
      latitude: 400000000,
      longitude: -750000000
    },
    hi: {
      latitude: 420000000,
      longitude: -730000000
    }
  };
  var call = client.listFeatures(rectangle);
  call.on('data', function(feature) {
      console.log('Found feature called "' + feature.name + '" at ' +
          feature.location.latitude/COORD_FACTOR + ', ' +
          feature.location.longitude/COORD_FACTOR);
  });
  call.on('end', function(end){
      console.log(end)
      console.log('end')
  });
  call.on('error', function(e) {
      console.log(e)
  });
  call.on('status', function(status) {
      console.log(status)
  });



// function main() {
//     async.series([
//       runGetFeature,
//       runListFeatures,
//       runRecordRoute,
//       runRouteChat
//     ]);
//   }