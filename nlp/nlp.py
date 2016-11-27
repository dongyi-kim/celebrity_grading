#!/usr/bin/python
#-*- coding:utf-8 -*-

import sys
import codecs
#from konlpy.tag import Kkma
from konlpy.tag import Komoran
#kkma = Kkma()
komoran = Komoran()

def getKeyword(nlp_result) :
    keyword = []
    for word in nlp_result :
        if (word[1] == 'NNG' or word[1] == 'VV') and len(word[0]) > 1:
	    keyword.append(word[0])
    return keyword

def doNLP(fname) :
    keyword = []
    with codecs.open(fname, 'r', encoding='utf8') as f:
        contents = f.readlines()

        for content in contents :
            if content.strip() == "" :
                continue

            nlp_result = komoran.pos(content)
            keyword = keyword + getKeyword(nlp_result)

    return keyword
