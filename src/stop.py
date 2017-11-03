# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.


class Stop:
    
    def __init__(self, stop_id, stop_name, time, seq, lat, lon):
        self.stop_id = stop_id
        self.stop_name = stop_name
        self.time = time
        self.seq = int(seq)
        self.lat = lat
        self.lon = lon
        
    def print_stop(self):
        print("%s, %s, %s, %s"
              %(self.stop_id, self.stop_name, self.time, self.seq))
        
    def write_stop(self, bid, tid, writer):
        writer.writerow([bid, tid, 
                         self.stop_id, self.stop_name, 
                         self.time, self.seq, 
                         self.lat, self.lon])
    
if __name__ == "__main__":
    print("This is the file for Class Stop. Run \"google_transit.py\" instead.")
