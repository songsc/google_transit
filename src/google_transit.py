# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import csv
import sys
import block as b
import trip as t

import trips_parser

if __name__ == "__main__":
    print("Hello World")
    
    print(trips_parser.query("20171021", ""))
    print(trips_parser.query("20171022", ""))
    print(trips_parser.query("20171023", ""))
    print(trips_parser.query("20171024", ""))
    print(trips_parser.query("20171025", ""))
    print(trips_parser.query("20171026", ""))
    print(trips_parser.query("20171027", ""))
    print(trips_parser.query("20171028", ""))
