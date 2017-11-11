/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const fs = require('fs');

//==============================================================================
// Helper Functions

exports.findTrips = function (host, filename, date, constriant, value, res) {
    var output_list = [];
    
    var lineReader = require('readline').createInterface( {
        input: fs.createReadStream(filename)
    });
    lineReader.on('line', function (trip) {
        if (trip !== '' && trip !== '/n') {            
            var trip_array = trip.split(',');
            trip_array[1] = trip_array[1].slice(trip_array[1].indexOf('-') + 1);
            switch (constriant) {
                case 'route':
                    if (trip_array[1].slice(0, trip_array[1].indexOf('-')) === value) {
                        //output = output + toHTML(host, date, trip_array);
                        output_list.push(trip_array);
                    }
                    break;
                case 'block':
                    if (trip_array[0] === value) {
                        //output = output + toHTML(host, date, trip_array);
                        output_list.push(trip_array);
                    }
                    break;
                default:
                    break;                    
            }           
        }
    });
    lineReader.on('close', function () {
        if (constriant === 'route') {
            output_list.sort(function(a, b) {
                // Sort based on direction first
                if (a[2] > b[2]) return 1;
                if (a[2] < b[2]) return -1;
                // Then sort based on trip number
                if (a[1] > b[1]) return 1;
                if (a[1] < b[1]) return -1;            
                return 0;
            });
        } else if (constriant === 'block') {
            output_list.sort(function(a, b) {
                // Sort based on departure time
                if (a[5] > b[5]) return 1;
                if (a[5] < b[5]) return -1;
           
                return 0;
            });
        }       
        
        if (host !== '') {
            var output = "";
            output_list.forEach(function (trip_array) {
                output = output + exports.toHTML(host, date, trip_array);
            });
            res.send(output);
        }
        if (host === '') {
            var output = [];
            output_list.forEach(function (trip_array) {
                output.push(exports.toJSON (host, date, trip_array));
            });
            res.send(
                    JSON.stringify({
                        type: 'result_trips',
                        data: {
                            result: output
                        }
                    })
            );
        }
        
    });  
};

exports.findStops = function (host, filename, date, constriant, value, res) {
    var output_list = [];
    
    var lineReader = require('readline').createInterface( {
        input: fs.createReadStream(filename)
    });
    lineReader.on('line', function (stop) {
        if (stop !== '' && stop !== '/n') {            
            var stop_array = stop.split(',');
            stop_array[1] = stop_array[1].slice(stop_array[1].indexOf('-') + 1);
            switch (constriant) {
                case 'trip':
                    if (stop_array[1].slice(stop_array[1].indexOf('-') + 1) === value) {
                        output_list.push(stop_array);
                    }
                    break;
                default:
                    break;                    
            }           
        }
    });
    lineReader.on('close', function () {
        if (constriant === 'trip') {
            output_list.sort(function(a, b) {
                var time_a = a[4].split(':');
                var time_b = b[4].split(':');
                // Sort based on departure time         
                if (time_a[0] > time_b[0]) return 1;
                if (time_a[0] < time_b[0]) return -1;
                if (time_a[1] > time_b[1]) return 1;
                if (time_a[1] < time_b[1]) return -1;
            });
        }
        
        var block;
        var route;
        if (output_list.length !== 0) {
            block = output_list[0][0];
            route = output_list[0][1].slice(0, output_list[0][1].indexOf('-'));
        }
        if (host !== '') {
            var output = '<p>Block ID: ' +
                 '<a href=\"http://'+ host +'/date/'+date+'/block/'+block+'\">'+block+'</a>' +
                 '</p>' + 
                 '<p>Route: ' + 
                 '<a href=\"http://'+ host +'/date/'+date+'/route/'+route+'\">'+route+'</a>';                 
        
            output_list.forEach(function (stop_array) {
                output = output + exports.toHTML2(host, date, stop_array);
            });
            res.send(output);
        }
        if (host === '') {
            var output = [];
            output_list.forEach(function (trip_array) {
                output.push(exports.toJSON2 (host, date, trip_array));
            });
            res.send(
                    JSON.stringify({
                        type: 'result_stops',
                        data: {
                            block: block,
                            route: route,
                            result: output
                        }
                    })
            );
        }
        
    });  
};

exports.toHTML = function (host, date, line_array) {
    var route = line_array[1].slice(0, line_array[1].indexOf('-'));
    var trip = line_array[1].slice(line_array[1].indexOf('-') + 1);
    return '<p>' +
           '<a href=\"http://'+ host +'/date/'+date+'/block/'+line_array[0]+'\">'+line_array[0]+'</a>' +
           ', <a href=\"http://'+ host +'/date/'+date+'/route/'+route+'\">'+route+'</a>' +
           ', <a href=\"http://'+ host +'/date/'+date+'/trip/'+trip+'\">'+trip+'</a>' +
           ', ' + line_array[3] +
           ', ' + line_array[4] +
           ', ' + line_array[5] +
           ', ' + line_array[6] +
           ', ' + line_array[7] +
           ', ' + line_array[8] +
           '</p>';
};

exports.toHTML2 = function (host, date, line_array) {
    return '<p>' + line_array[3] + ': ' + line_array[4] + '</p>';            
};

exports.toJSON = function (host, date, line_array) {
    var route = line_array[1].slice(0, line_array[1].indexOf('-'));
    var trip = line_array[1].slice(line_array[1].indexOf('-') + 1);
    return [line_array[0],
            route, 
            trip, 
            line_array[3], 
            line_array[4], 
            line_array[5], 
            line_array[6], 
            line_array[7], 
            line_array[8]];
};

exports.toJSON2 = function (host, date, line_array) {
    return [line_array[3], line_array[4]];            
};

exports.checkFile = function (file) {
    if(fs.existsSync(file)) return true;
    return false;
}