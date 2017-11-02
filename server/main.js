/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const express = require('express');
const app = express();
const fs = require('fs');
var Promise = require('promise');

const host = '127.0.0.1:3001';

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/date/:date/route/:route', function (req, res) {
    console.log(req.params);
    const date = req.params.date.replace(/-/g, "");
    const route = req.params.route;    
    const file = date + '.txt';
    console.log('File Name: ' + file);

    findTrips(file, date, 'route', route, res);
});

app.get('/date/:date/block/:block', function (req, res) {
    console.log(req.params);
    const date = req.params.date.replace(/-/g, "");
    const block = req.params.block;    
    const file = date + '.txt';
    console.log('File Name: ' + file);

    findTrips(file, date, 'block', block, res);
});

app.post('/', function (req, res) {
    console.log('R');
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});

function findTrips(filename, date, constriant, value, res) {
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

function toHTML(host, date, line_array) {
    var route = line_array[1].slice(0, line_array[1].indexOf('-'));
    var trip = line_array[1].slice(line_array[1].indexOf('-') + 1);
    return '<p>' +
           '<a href=\"http://'+ host +'/date/'+date+'/block/'+line_array[0]+'\">'+line_array[0]+'</a>' +
           ', <a href=\"http://'+ host +'/date/'+date+'/route/'+route+'\">'+route+'</a>' +
           ', <a href=\"http://'+ host +'/date/'+date+'/route/'+route+'\">'+trip+'</a>' +
           ', ' + line_array[3] +
           ', ' + line_array[4] +
           ', ' + line_array[5] +
           ', ' + line_array[6] +
           ', ' + line_array[7] +
           ', ' + line_array[8] +
           '</p>';
}