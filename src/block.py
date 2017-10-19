# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import trip as t

class Block():
    
    def __init__(self):
        self.trips = []
            
    def add_trip(self, bid, tid, headsign, depart, arrival):
        trip = t.Trip(bid, tid, headsign, depart, arrival)
        self.trips.insert(0, trip)

    def print_block(self):
        for trip in self.trips:
            trip.print_trip()
    
    def write_block(self, writer):
        for trip in self.trips:
            trip.write_trip(writer)
        
if __name__ == "__main__":
    print("This is the file for Class Block. Run \"google_transit.py\" instead.")
