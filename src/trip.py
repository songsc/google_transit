# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

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

if __name__ == "__main__":
    print("This is the file for Class Trip. Run \"google_transit.py\" instead.")
