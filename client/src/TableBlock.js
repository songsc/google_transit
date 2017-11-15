import React, { Component } from 'react';

function Block(props) {
    return (
        <td className="block" onClick={props.onClick} style={{color:props.colour}}>
            {props.value}
        </td>
    );
}

class TableRow extends React.Component {
    onClick(i) {
        if(i === 0) {
            this.props.blockClick(this.props.values[i]);
        }
        else if(i === 1) {
            this.props.routeClick(this.props.values[i]);
        }
        else if(i === 2) {
            this.props.tripClick(this.props.values[i]);
        }
        else {
            
        }
    }
    
    renderBlock(i) {
        return (
            <Block
                key={i}
                value={this.props.values[i]}
                colour={this.props.colours[i]}
                onClick={() => this.onClick(i)}
            />
        );
    }

    render() {
        var blocks = [];
        for(var i = 0; i < this.props.values.length; i++ ) {
            blocks.push(this.renderBlock(i));
        }

        return (
            <tr>
            {blocks}              
            </tr>
        );
    }
}

class TripTable extends React.Component {
    render() {
        var rows = [];
        if(this.props.rows === null) return null;
        for(var i = 0; i < this.props.rows.length; i++ ) {
            // Multiply by the magic of prime
            rows.push(<TableRow key={i*11} 
                                values={this.props.rows[i]}
                                colours={['Blue', 'Blue', 'Blue', 'Black', 'Black', 'Black', 'Black', 'Black', 'Blue']}
                                routeClick={this.props.routeClick}
                                blockClick={this.props.blockClick}
                                tripClick={this.props.tripClick}                  
                      />);
        }
        return (
            <div className="tripTable">
                <table>
                    <thead><tr>
                           <th>Block ID</th>
                           <th>Route</th>
                           <th>Trip ID</th>
                           <th>Trip Description</th>
                           <th>Origin</th>
                           <th>Departure Time</th>
                           <th>Destination</th>
                           <th>Arrival Time</th>
                           <th>Map</th>
                           </tr></thead>
                    <tbody>{rows}</tbody>                    
                </table>
            </div>
        );
    }
}

class StopTable extends React.Component {
    render() {
        var rows = [];
        if(this.props.rows === null) return null;
        for(var i = 0; i < this.props.rows.length; i++ ) {
            // Multiply by the magic of prime
            rows.push(<TableRow key={i*11} 
                                values={this.props.rows[i]}
                                colours={['Black', 'Black']}
                      />);
        }
        return (
            <div className="stopTable">
                <table>
                    <thead><tr><th>Stop</th><th>Time</th></tr></thead>
                    <tbody>{rows}</tbody>                    
                </table>
            </div>
        );
    }
}

class Table extends React.Component {
    render() {
        if(this.props.rows === null) return null;
        if(this.props.display === 'trips')
        {
            return (<TripTable rows={this.props.rows} 
                               routeClick={this.props.routeClick}
                               blockClick={this.props.blockClick}
                               tripClick={this.props.tripClick}
                    />);
        }
        else if(this.props.display === 'stops')
        {
            return (<StopTable rows={this.props.rows}
                               route={this.props.route}
                               block={this.props.block}
                    />);
        }
        else {
            return null;
        }
    }
}

export default Table;