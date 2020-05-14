const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc')
const uuidv1 = require('uuid/v1')
const PROTO_PATH = './grpcRoute.proto';
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: ['./grpc']
}
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const packageObject = grpc.loadPackageDefinition(packageDefinition);
module.exports = packageObject.grpcRoute;