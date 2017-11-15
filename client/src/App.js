import React, { Component } from 'react';
import Table from './TableBlock.js';


class App extends React.Component {
    ws = new WebSocket('ws://127.0.0.1:8081');
    
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            type: '',
            route: '',
            block: '',
            trip: '',
            result: null,
            display: 'empty'
        };
        this.dateChange = this.dateChange.bind(this);
        this.routeChange = this.routeChange.bind(this);
        this.blockChange = this.blockChange.bind(this);
        this.tripChange = this.tripChange.bind(this);
        this.routeSubmit = this.routeSubmit.bind(this);
        this.blockSubmit = this.blockSubmit.bind(this);
        this.tripSubmit = this.tripSubmit.bind(this);
        this.routeClick = this.routeClick.bind(this);
        this.blockClick = this.blockClick.bind(this);
        this.tripClick = this.tripClick.bind(this);
    }
    
    componentDidMount() {
        this.ws.onmessage = function (res) {
            var data = JSON.parse(res.data);
            if (data.type === 'result_trips') {
                this.setState({result: this._displayTable(data.data)});
                this.setState({display: 'trips'});
            }  
            if (data.type === 'result_stops') {
                this.setState({result: this._displayTable(data.data)});
                if(data.data.route !== '')
                    this.setState({route: data.data.route});
                else
                    this.setState({route: ''});
                if(data.data.block !== '')
                    this.setState({block: data.data.block});
                else
                    this.setState({block: ''});
                this.setState({display: 'stops'});
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
    
    routeClick(route) {
        this.ws.send (
                JSON.stringify({
                    type: 'route',
                    data: {
                        date: this.state.date,
                        route: route
                    }
                }));           
    }
    
    blockClick(block) {
        this.ws.send (
                JSON.stringify({
                    type: 'block',
                    data: {
                        date: this.state.date,
                        block: block
                    }
                }));           
    }
    
    tripClick(trip) {
        this.ws.send (
                JSON.stringify({
                    type: 'trip',
                    data: {
                        date: this.state.date,
                        trip: trip
                    }
                }));           
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
                
                <Table rows={this.state.result}
                       route={this.state.route}
                       block={this.state.block}
                       display={this.state.display}
                       routeClick={this.routeClick}
                       blockClick={this.blockClick}
                       tripClick={this.tripClick}
                />
            </div>
                );
    }    
    
    _displayTable (data) {
        var table = [];
        data.result.forEach(function (line) {
           var row = [];
           line.forEach(function (entry) {
               row.push(entry);
           });
           table.push(row);
        });
        return table;
    }    
}

export default App;