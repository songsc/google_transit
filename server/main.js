/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const fs = require('fs');

const helper = require('./helper.js');


const exp_app = express();
const server = http.createServer(exp_app);
server.listen(3002, function listening() {
    console.log('Frontend app listening on port 3002!');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function (ws, req) {
    ws.on('message', function (query) {
        query = JSON.parse(query);
        console.log(query.type, query.data);
        if (query.type === 'route') {
            const date = query.data.date.replace(/-/g, "");
            const route = query.data.route;    
            const file = 'trips/' + date + '_trips.txt';
            
            if (helper.checkFile(file)) {
                helper.findTrips('', file, date, 'route', route, ws);
            }
            else {
                ws.send('File not found!');
            }
        }
        else if (query.type === 'block') {
            const date = query.data.date.replace(/-/g, "");
            const block = query.data.block;    
            const file = 'trips/' + date + '_trips.txt';
            
            if (helper.checkFile(file)) {
                helper.findTrips('', file, date, 'block', block, ws);
            }
            else {
                ws.send('File not found!');
            }
        }
        else if (query.type === 'trip') {
            const date = query.data.date.replace(/-/g, "");
            const trip = query.data.trip;    
            const file = 'stops/' + date + '_stops.txt';
            
            if (helper.checkFile(file)) {
                helper.findStops('', file, date, 'trip', trip, ws);
            }
            else {
                ws.send('File not found!');
            }
        }
    });  
});

//==============================================================================
// Backend App

const app = express();
app.listen(8080, function () {
    console.log('Backend app listening on port 8080!');
});

app.get('/', function (req, res) {
    const host = req.headers['host'];
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var day = d.getDate();
    if (day < 10) day = '0' + day;
    var date = year + '' + month + '' + day;
    
    var output = '<p>Google Transit Static Feed Parser for GO Transit</p>' +
                 '<br>' +
                 '<p>To search the trips of a sepecific route: </p>' +
                 '<p>Use the following link format: ' + host + '/date/yyyymmdd/route/xx </p>' +
                 '<p>Example: <a href=\"http://' + host + '/date/' + date + '/route/21\">' +
                 'http://' + host + '/date/' + date + '/route/21</a></p>' +
                 '<br>' +
                 '<p>To search the trips of a sepecific block (also known as run number): </p>' +
                 '<p>Use the following link format: ' + host + '/date/yyyymmdd/block/xxxx </p>' +
                 '<p>Example: <a href=\"http://' + host + '/date/' + date + '/block/01A\">' +
                 'http://' + host + '/date/' + date + '/block/01A</a></p>' +
                 '<br>' +
                 '<p>To search the timetable of a sepecific trip: </p>' +
                 '<p>Use the following link format: ' + host + '/date/yyyymmdd/trip/xxxx </p>' +
                 '<p>Example: <a href=\"http://' + host + '/date/' + date + '/trip/908\">' +
                 'http://' + host + '/date/' + date + '/trip/908</a></p>';
    res.send(output);
});

app.get('/date/:date/route/:route', function (req, res) {
    const host = req.headers['host'];
    const date = req.params.date.replace(/-/g, "");
    const route = req.params.route;    
    const file = 'trips/' + date + '_trips.txt';
    console.log(req.params);

    if (helper.checkFile(file)) {
        helper.findTrips(host, file, date, 'route', route, res);
    }
    else {
        res.send('File not found!');
    }
});

app.get('/date/:date/block/:block', function (req, res) {
    const host = req.headers['host'];
    const date = req.params.date.replace(/-/g, "");
    const block = req.params.block;    
    const file = 'trips/' + date + '_trips.txt';
    console.log(req.params);
    
    if (helper.checkFile(file)) {
        helper.findTrips(host, file, date, 'block', block, res);
    }
    else {
        res.send('File not found!');
    }
});

app.get('/date/:date/trip/:trip', function (req, res) {
    const host = req.headers['host'];
    const date = req.params.date.replace(/-/g, "");
    const trip= req.params.trip;    
    const file = 'stops/' + date + '_stops.txt';
    console.log(req.params);
    
    if (helper.checkFile(file)) {
        helper.findStops(host, file, date, 'trip', trip, res);
    }
    else {
        res.send('File not found!');
    }
});

app.post('/', function (req, res) {
    console.log('Not yet implemented!@#$');
});
