/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/date/:date/route/:route', function (req, res) {
    const host = req.headers['host'];
    const date = req.params.date.replace(/-/g, "");
    const route = req.params.route;    
    const file = 'trips/' + date + '_trips.txt';
    console.log(req.params);

    findTrips(host, file, date, 'route', route, res);
});

app.get('/date/:date/block/:block', function (req, res) {
    const host = req.headers['host'];
    const date = req.params.date.replace(/-/g, "");
    const block = req.params.block;    
    const file = 'trips/' + date + '_trips.txt';
    console.log(req.params);
    
    findTrips(host, file, date, 'block', block, res);
});

app.get('/date/:date/trip/:trip', function (req, res) {
    const host = req.headers['host'];
    const date = req.params.date.replace(/-/g, "");
    const trip= req.params.trip;    
    const file = 'stops/' + date + '_stops.txt';
    console.log(req.params);
    
    findStops(host, file, date, 'trip', trip, res);
});

app.post('/', function (req, res) {
    console.log('R');
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});

function findTrips(host, filename, date, constriant, value, res) {
    var output_list = [];
    var output = "";
    
    var lineReader = require('readline').createInterface( {
        input: fs.createReadStream(filename)
    });
    lineReader.on('line', function (trip) {
        if (trip !== '' && trip !== '/n') {            
            var trip_array = trip.split(',');
            trip_array[1] = trip_array[1].slice(trip_array[1].indexOf('-') + 1);
            switch (constriant) {
                case 'route':
                    if (trip_array[1].slice(0, trip_array[1].indexOf('-')).search(value) > -1) {
                        //output = output + toHTML(host, date, trip_array);
                        output_list.push(trip_array);
                    }
                    break;
                case 'block':
                    if (trip_array[0].search(value) > -1) {
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
        
        output_list.forEach(function (trip_array) {
            output = output + toHTML(host, date, trip_array);
        });
        res.send(output);
    });  
}

function findStops(host, filename, date, constriant, value, res) {
    var output_list = [];
    var output = "";
    
    var lineReader = require('readline').createInterface( {
        input: fs.createReadStream(filename)
    });
    lineReader.on('line', function (stop) {
        if (stop !== '' && stop !== '/n') {            
            var stop_array = stop.split(',');
            stop_array[1] = stop_array[1].slice(stop_array[1].indexOf('-') + 1);
            switch (constriant) {
                case 'trip':
                    if (stop_array[1].slice(stop_array[1].indexOf('-') + 1).search(value) > -1) {
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
                // Sort based on stop sequence           
                return (a[5] - b[5]);
            });
        }
        
        var block = output_list[0][0];
        var route = output_list[0][1].slice(0, output_list[0][1].indexOf('-'));
        output = '<p>Block ID: ' +
                 '<a href=\"http://'+ host +'/date/'+date+'/block/'+block+'\">'+block+'</a>' +
                 '</p>' + 
                 '<p>Route: ' + 
                 '<a href=\"http://'+ host +'/date/'+date+'/route/'+route+'\">'+route+'</a>';                 
        
        output_list.forEach(function (stop_array) {
            output = output + toHTML2(host, date, stop_array);
        });
        res.send(output);
    });  
}

function toHTML(host, date, line_array) {
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
}

function toHTML2(host, date, line_array) {
    return '<p>' + line_array[3] + ': ' + line_array[4] + '</p>';
            
}