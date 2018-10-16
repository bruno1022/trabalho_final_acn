var fs = require('fs'); 
var jwt = require('jsonwebtoken'); 
var mqtt = require('mqtt'); 
 
var projectId = 'eighth-jigsaw-219600'; 
var cloudRegion = 'us-central1'; 
var registryId = 'my-registry'; 
var deviceId = 'my-device'; 
 
var mqttHost = 'mqtt.googleapis.com'; 
var mqttPort = 443; 
var privateKeyFile = '../certs/rsa_private.pem'; 
var algorithm = 'RS256'; 
var messageType = 'state'; // state or event 
 
var mqttClientId = `projects/${projectId}/locations/${cloudRegion}/registries/${registryId}/devices/${deviceId}`;
var mqttTopic = `/devices/${deviceId}/${messageType}`;
 
var connectionArgs = { 
  host: mqttHost, 
  port: mqttPort, 
  clientId: mqttClientId, 
  username: 'unused', 
  password: createJwt(projectId, privateKeyFile, algorithm),
  protocol: 'mqtts', 
  secureProtocol: 'TLSv1_2_method',
  protocolVersion: 4
}; 
 
console.log('connecting...'); 
var client = mqtt.connect(connectionArgs); 
 
// Subscribe to the /devices/{device-id}/config topic to receive config updates. 
client.subscribe('/devices/' + deviceId + '/my-device-events'); 
 
client.on('connect', function(success) { 
  if (success) { 
    console.log('Client connected...'); 
    sendData(); 
  } else { 
    console.log('Client not connected...'); 
  } 
}); 
 
client.on('close', function() { 
  console.log('close'); 
}); 
 
client.on('error', function(err) { 
  console.log('error', err); 
}); 
 
client.on('message', function(topic, message, packet) { 
  console.log(topic, 'message received: ', Buffer.from(message, 'base64').toString('ascii')); 
}); 
 
function createJwt(projectId, privateKeyFile, algorithm) { 
  var token = { 
    'iat': parseInt(Date.now() / 1000), 
    'exp': parseInt(Date.now() / 1000) + 86400 * 60, // 1 day 
    'aud': projectId 
  }; 
  var privateKey = fs.readFileSync(privateKeyFile, 'utf8'); 
  return jwt.sign(token, privateKey, { 
    algorithm: algorithm
  }); 
} 
 
function fetchData() { 
  var readout = dht.read(); 
  var temp = readout.temperature.toFixed(2); 
  var humd = readout.humidity.toFixed(2); 
 
  return { 
    'temp': temp, 
    'humd': humd, 
    'time': new Date().toISOString().slice(0, 19).replace('T', ' ') // https://stackoverflow.com/a/11150727/1015046 
  }; 
} 
 
function sendData() { 
  var payload = fetchData(); 
 
  payload = JSON.stringify(payload); 
  console.log(mqttTopic, ': Publishing message:', payload); 
  client.publish(mqttTopic, payload, { qos: 1 }); 
 
  console.log('Transmitting in 30 seconds'); 
  setTimeout(sendData, 30000); 
}
