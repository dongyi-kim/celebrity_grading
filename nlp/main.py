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
for filename in os.listdir(dir):
    path = os.path.join(dir, filename)
    name = filename.split(".")
    name = unicode(name[0], 'utf-8')
    print ("***" + name + "***")

    nlp_result = nlp.doNLP(path)

    up_word = 0
    new_word = 0

    remove_dup_list = list(set(nlp_result))
    for word in remove_dup_list :
        is_exist_query = "select count(*) from words where word = \'" + word + "\'"
        curs.execute(is_exist_query.encode('utf8'))
        (number_of_rows,) = curs.fetchone()
        words_db_query = ""

        if number_of_rows > 0 :
            up_word = up_word + 1
            words_db_query = "update words set mentioned = mentioned + 1 where (word = \'" + word + "\')"
        else :
            new_word = new_word + 1
            words_db_query = "insert into words(word, positive, negative, useless, mentioned) values(\'" + word + "\', 0, 0, 0, 1)"

        curs.execute(words_db_query.encode('utf8'))

        frequency_db_query = "insert into frequency values(\"" + name + "\", \"" + word + "\", " + str(nlp_result.count(word)) + ")"
        curs.execute(frequency_db_query.encode('utf8'))

    conn.commit()

    print ("Updated words # : " + str(up_word))
    print ("Inserted words # : " + str(new_word))

conn.close()