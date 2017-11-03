# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import stop as s

class Trip:
    
    def __init__(self, bid, tid, direct, headsign, origin, depart, destin, arrival, shape):
        self.bid = bid
        self.tid = tid
        self.direct = direct
        self.headsign = headsign
        self.origin = origin
        self.depart = depart
        self.destin = destin
        self.arrival = arrival
        self.shape = shape
        self.stops = []
        
    def update_origin(self, origin, depart):
        self.origin = origin
        self.depart = depart
        
    def update_destin(self, destin, arrival):
        self.destin = destin
        self.arrival = arrival
        
    def add_stop(self, stop_id, stop_name, time, seq, lat, lon):
        stop = s.Stop(stop_id, stop_name, time, seq, lat, lon)
        self.stops.insert(0, stop)
        
    def add_stop_ref(self, stop):
        self.stops.insert(0, stop)
        
    def print_trip(self):
        print("%s, %s, %s, %s, %s, %s, %s, %s, %s" 
            %(self.bid, self.tid, 
              self.direct, self.headsign, 
              self.origin, self.depart, 
              self.destin, self.arrival,
              self.shape))
    
    def write_trip(self, writer):
        writer.writerow([self.bid, self.tid, 
                         self.direct, self.headsign, 
                         self.origin, self.depart, 
                         self.destin, self.arrival,
                         self.shape])
    
    def print_stops(self):
        for stop in self.stops:
            stop.print_stop()
                         
    def write_stops(self, writer):
        for stop in self.stops:
            stop.write_stop(self.bid, self.tid, writer)

if __name__ == "__main__":
    print("This is the file for Class Trip. Run \"google_transit.py\" instead.")
