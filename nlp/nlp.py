#!/usr/bin/python
#-*- coding:utf-8 -*-

import sys
import codecs
#from konlpy.tag import Kkma
from konlpy.tag import Komoran
from konlpy.utils import pprint
#kkma = Kkma()
komoran = Komoran()
keyword = []

def getKeyword(nlp_result) :
	for word in nlp_result :
		if (word[1] == 'NNG' or word[1] == 'VV') and len(word[0]) > 1:
			keyword.append(word[0])

def doNLP(fname) :
    with codecs.open(fname, 'r', encoding='utf8') as f:
        contents = f.readlines()

        for content in contents :
            if content.strip() == "" :
                continue

            nlp_result = komoran.pos(content)
            getKeyword(nlp_result)

    return list(set(keyword))

#pprint(result)
