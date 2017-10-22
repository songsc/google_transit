# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import csv
import sys
import block as b
import trip as t

def query(input_date, input_route):
    
    # TO DO: Implement exception handling!
    F_dates = open("data/calendar_dates.txt", 'rt')
    reader_dates = csv.reader(F_dates)
    F_trips = open("data/trips.txt", 'rt')
    reader_trips = csv.reader(F_trips)
    F_times = open("data/stop_times.txt", 'rt')
    reader_times = csv.reader(F_times)
    
    # Make sure the date is in range.
    for date in reader_dates:
        if input_date == date[0]: break
    if input_date != date[0]:
        return "Error: Date out of range"
    
    out_file = "output/" + input_date + "_" + input_route + ".txt"
    F_blocks = open(out_file, 'w')
    writer_blocks = csv.writer(F_blocks)
    
    blocks = []
    temp_block = b.Block()
    
    trip = next(reader_trips)
    times1 = next(reader_times) # See below for explanation.
    #times2 = times1
    writer_blocks.writerow([trip[6], trip[2], trip[3], times1[2], times1[1]])
    times1 = next(reader_times)
            
    trip_count = 0
    for trip in reader_trips:        
        if input_date != "" and trip[1] != input_date: continue
        trip_count += 1
        
        while times1[0] != trip[2]:
            times2 = times1
            try:
                times1 = next(reader_times)
            except StopIteration:
                break
                
        # Only interested in the stop times at the origin and destination.
        # Since stop times are listed in reverse chronological order,
        # the first line for each trip is the arrival time,
        # and the last line for each trip is the departure time.
        arrival = times1[1]
        while times1[0] == trip[2]:
            times2 = times1
            try:
                times1 = next(reader_times)
            except StopIteration:
                break                
        depart = times2[1]
        
        if temp_block.get_bid() == "" or temp_block.get_bid() == trip[6]:
            temp_block.add_trip(trip[6], trip[2], trip[3], depart, arrival)
        else:
            blocks.insert(0, temp_block)
            temp_block = b.Block()
            temp_block.add_trip(trip[6], trip[2], trip[3], depart, arrival)
        
    for block in blocks:
        block.write_block(writer_blocks)

    F_dates.close()
    F_trips.close()
    F_times.close()
    F_blocks.close()
    
    return ("Found %d trips. Check output folder." %(trip_count))

