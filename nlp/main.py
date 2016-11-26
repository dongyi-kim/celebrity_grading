#!/usr/bin/python
#-*- coding:utf-8 -*-

import sys
import pymysql
import pprint
import nlp

class MyPrettyPrinter(pprint.PrettyPrinter):
	def format(self, _object, context, maxlevels, level):
		if isinstance(_object, unicode):
			return "'%s'" % _object.encode('utf8'), True, False
		elif isinstance(_object, str):
			_object = unicode(_object,'utf8')
			return "'%s'" % _object.encode('utf8'), True, False
		return pprint.PrettyPrinter.format(self, _object, context, maxlevels, level)

conn = pymysql.connect(host="codingmonster.net",
		       port=3306,
		       user="datamining",
		       password="dm2016",
		       db="celebrity_grading")

conn.query("set character_set_connection=utf8;")
conn.query("set character_set_server=utf8;")
conn.query("set character_set_client=utf8;")
conn.query("set character_set_results=utf8;")
conn.query("set character_set_database=utf8;")

curs = conn.cursor()
#curs.execute("set names utf8")

nlp_result = nlp.doNLP(sys.argv[1])

up_word = 0
new_word = 0
for word in nlp_result :
    is_exist_query = "select * from words where word = \'" + word + "\';"
    curs.execute(is_exist_query.encode('utf8'))
    rows = curs.fetchall()
    query = ""

    if len(rows) > 0 :
        up_word = up_word + 1
        query = "update words set mentioned = mentioned + 1 where (word = \'" + word + "\')"
    else :
        new_word = new_word + 1
        query = "insert into words(word, positive, negative, useless, mentioned) values(\'" + word + "\', 0, 0, 0, 1)"

    curs.execute(query.encode('utf8'))

conn.commit()
conn.close()

print ("Updated words # : %d", up_word)
print ("Inserted words # : %d", new_word)