#!/usr/bin/python
#-*- coding:utf-8 -*-

import sys
import pymysql
import nlp
import os

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

dir = "../word_collector/data"
for name in os.listdir(dir):
    path = os.path.join(dir, name)

    nlp_result = nlp.doNLP(path)

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

    print ("Updated words # : " + str(up_word))
    print ("Inserted words # : " + str(new_word))