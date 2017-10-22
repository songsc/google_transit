# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import trip as t

class Block():
    
    def __init__(self):
        self.bid = ""
        self.num_trips = 0
        self.utilization = 0
        self.trips = []
        
    def set_bid(self):
        self.bid = bid
        
    def get_bid(self):
        return self.bid
        
    def inc_trip(self):
        self.num_trips = self.num_trips + 1
        
    def set_trip(self, num_trips):
        self.num_trips = num_trips
            
    def add_trip(self, bid, tid, headsign, depart, arrival):
        if self.bid == "": self.bid = bid
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
