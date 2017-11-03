# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import csv
import block as b
import trip as t
import stop as s

def query(input_date, input_route):
    
    # TO DO: Implement exception handling!
    F_dates = open("data/calendar_dates.txt", 'rt')
    reader_dates = csv.reader(F_dates)
    F_trips = open("data/trips.txt", 'rt')
    reader_trips = csv.reader(F_trips)
    F_times = open("data/stop_times.txt", 'rt')
    reader_times = csv.reader(F_times)
    F_stops = open("data/stops.txt", 'rt')
    reader_stops = csv.reader(F_stops)
    
    # Make sure the date is in range.
    for date in reader_dates:
        if input_date == date[0]: break
    if input_date != date[0]:
        return "Error: Date out of range"
    
    out_date_blocks = "output/trips/" + input_date + "_trips.txt"
    F_date_blocks = open(out_date_blocks, 'w')
    writer_date_blocks = csv.writer(F_date_blocks)    
    out_date_stops = "output/stops/" + input_date + "_stops.txt"
    F_date_stops = open(out_date_stops, 'w')
    writer_date_stops = csv.writer(F_date_stops)
    
    trip = next(reader_trips)
    times1 = next(reader_times)
    stop = next(reader_stops)
    # Write headers
    writer_date_blocks.writerow([trip[6], trip[2], trip[5], trip[3], "origin", times1[2], "destination", times1[1]])  # Header
    writer_date_stops.writerow([stop[0], stop[1], times1[2], times1[4], stop[2], stop[3]])
    times1 = next(reader_times)
    
    blocks = []  # List of blocks
    temp_block = b.Block() # A single block element        
    trip_count = 0
    for trip in reader_trips:
        # Move to the selected date 
        if input_date != "" and trip[1] != input_date: continue
        
        trip_count += 1        
        new_trip = t.Trip(trip[6], trip[2], trip[5], trip[3], "", "", "", "", trip[7])
        temp_stop_list = []
        
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
        destin_id = times1[3]
        while times1[0] == trip[2]:
            new_stop = s.Stop(times1[3], "", times1[2], times1[4], "", "")
            temp_stop_list.insert(0, new_stop)
            times2 = times1
            try:
                times1 = next(reader_times)
            except StopIteration:
                break                
        depart = times2[1]
        origin_id = times2[3]
        
        origin = "null"
        destin = "null"


        while origin == "null" or destin == "null" or len(temp_stop_list) != 0:
            try:
                stop = next(reader_stops)
                if stop[0] == origin_id: origin = stop[1]
                if stop[0] == destin_id: destin = stop[1]
                for temp_stop in temp_stop_list:
                    if stop[0] == temp_stop.stop_id:
                        temp_stop_list.remove(temp_stop)
                        temp_stop.stop_name = stop[1]
                        temp_stop.lat = stop[2]
                        temp_stop.lon = stop[3]
                        new_trip.add_stop_ref(temp_stop)                
            except StopIteration:
                F_stops.seek(0)
                
        new_trip.update_origin(origin, depart)
        new_trip.update_destin(destin, arrival)
        
        if temp_block.get_bid() == "null" or temp_block.get_bid() == trip[6]:
            temp_block.add_trip_ref(new_trip)
        else:
            blocks.insert(0, temp_block)
            temp_block = b.Block()
            temp_block.add_trip_ref(new_trip)
    # Make sure to add the last block        
    blocks.insert(0, temp_block)
        
    for block in blocks:
        block.write_block(writer_date_blocks)
        block.write_stops(writer_date_stops)

    F_dates.close()
    F_trips.close()
    F_times.close()
    F_stops.close()
    F_date_blocks.close()
    F_date_stops.close()
    
    return ("Found %d trips. Check output folder." %(trip_count))

