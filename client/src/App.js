import React, { Component } from 'react';


class App extends React.Component {
    ws = new WebSocket('ws://192.168.0.13:3002');
    
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            type: '',
            route: '',
            block: '',
            trip: '',
            result: ''
        };
        this.dateChange = this.dateChange.bind(this);
        this.routeChange = this.routeChange.bind(this);
        this.blockChange = this.blockChange.bind(this);
        this.tripChange = this.tripChange.bind(this);
        this.routeSubmit = this.routeSubmit.bind(this);
        this.blockSubmit = this.blockSubmit.bind(this);
        this.tripSubmit = this.tripSubmit.bind(this);
    }
    
    componentDidMount() {
        this.ws.onmessage = function (res) {
            var data = JSON.parse(res.data);
            if (data.type === 'result_trips') {
                this.setState({result: this._displayTrips(data.data)});
            }  
            if (data.type === 'result_stops') {
                this.setState({result: this._displayStops(data.data)});
            }
        }.bind(this);
    }
    
    dateChange(event) {
        this.setState({date: event.target.value});
    }
    
    routeChange(event) {
        this.setState({route: event.target.value});
    }
    
    blockChange(event) {
        this.setState({block: event.target.value});
    }
    
    tripChange(event) {
        this.setState({trip: event.target.value});
    }
    
    routeSubmit(event) {
        this.ws.send (
                JSON.stringify({
                    type: 'route',
                    data: {
                        date: this.state.date,
                        route: this.state.route
                    }
                }));                
        event.preventDefault();
    }
    
    blockSubmit(event) {
        this.ws.send (
                JSON.stringify({
                    type: 'block',
                    data: {
                        date: this.state.date,
                        block: this.state.block
                    }
                }));                
        event.preventDefault();
    }
    
    tripSubmit(event) {
        this.ws.send (
                JSON.stringify({
                    type: 'trip',
                    data: {
                        date: this.state.date,
                        trip: this.state.trip
                    }
                }));                
        event.preventDefault();
    }
    
    render() {
        return (
            <div className="dashboard">
                <h1>Fill this later</h1>
                <label>
                    Date:
                    <input type="date" 
                           name="Date" 
                           value={this.state.date} 
                           onChange={this.dateChange} 
                    />
                </label>
                <br />                
                <label>
                    Route:
                    <input type="input" 
                           name="Route"
                           value={this.state.route}
                           onChange={this.routeChange} 
                    />
                </label>
                <button type="button" onClick={this.routeSubmit}>Search by Route</button>
                <br />
                <label>
                    Block:
                    <input type="input" 
                           name="Block"
                           value={this.state.block}
                           onChange={this.blockChange} 
                    />
                </label>
                <button type="button" onClick={this.blockSubmit}>Search by Block</button>
                <br />
                <label>
                    Trip:
                    <input type="input" 
                           name="Trip"
                           value={this.state.trip}
                           onChange={this.tripChange} 
                    />
                </label>
                <button type="button" onClick={this.tripSubmit}>Search by Trip</button>
                <br />
                
                <br />
                <div dangerouslySetInnerHTML={{__html:this.state.result}}></div>
            </div>
                );
    }
    
    _displayTrips(data) {
        var display = '<table style="width:100%">';
        display = display + '<tr>' +
                            '<th>Block ID</th>' +
                            '<th>Route</th>' +
                            '<th>Trip ID</th>' +
                            '<th>Trip Description</th>' +
                            '<th>Origin</th>' +
                            '<th>Departure Time</th>' +
                            '<th>Destination</th>' +
                            '<th>Arrival Time</th>' +
                            '<th>Map</th>' +
                            '</tr>';
        data.result.forEach(function (line) {
            display = display + '<tr>' +
                      '<td>' + line[0] + '</td>' + 
                      '<td>' + line[1] + '</td>' + 
                      '<td>' + line[2] + '</td>' + 
                      '<td>' + line[3] + '</td>' + 
                      '<td>' + line[4] + '</td>' + 
                      '<td>' + line[5] + '</td>' + 
                      '<td>' + line[6] + '</td>' + 
                      '<td>' + line[7] + '</td>' + 
                      '<td>' + line[8] + '</td>' +
                      '</tr>';
        });
        display = display + '</table>';
        
        return display;
    }
    
    _displayStops (data) {
        var display = '<span>Block ID: ' + data.block + '</span>' +
                      '<br />' +
                      '<span>Route: ' + data.route + '</span>' +
                      '<br />';
        display = display + '<table style="width:25%">';
        display = display + '<tr>' +
                            '<th>Stop</th>' +
                            '<th>Time</th>' +
                            '</tr>';
        data.result.forEach(function (line) {
            display = display + '<tr>';                
            line.forEach(function (entry) {
                display = display + '<td>' + entry + '</td>';  
            });
            display = display + '</tr>';  
        });
        display = display + '</table>';
        
        return display;
    }
}

export default App;