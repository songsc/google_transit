# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

class Trip:
    
    def __init__(self, bid, tid, headsign, depart, arrival):
        self.bid = bid
        self.tid = tid
        self.headsign = headsign
        self.depart = depart
        self.arrival = arrival
        
    def print_trip(self):
        print("%s, %s, %s, %s, %s" %(self.bid, self.tid, self.headsign, self.depart, self.arrival))
    
    def write_trip(self, writer):
        writer.writerow([self.bid, self.tid, self.headsign, self.depart, self.arrival])

if __name__ == "__main__":
    print("Hello World")
