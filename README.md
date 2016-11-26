1. Business Understanding

(1) Background
  일반 대중들은 신문, 방송, 인터넷을 통해 공인(公人)에 대한 사회적 평판을 접하고, 이를 기준으로 여론을 형성하기도 하며, 호불호를 판단하는 경향이 있다.
  단어를 받아들임에 있어서, 긍정/부정에 대한 느낌으로만 이해하는 경향이 있으며, 수치화(digitize) 시켜서 이해하지 않는다. 예를 들어, ‘심각’ ‘나쁨’과 같은 표현을 이해함에 있어서, 부정적으로 인식하기는 하지만, 그것의 정도에 대한 객관적 측도는 존재하지 않기에, 기계 학습 분야의 적용에 어려움이 있다. 우리는 웹 기반의 설문조사를 바탕으로, 특정 단어의 긍정/부정에 관한 대중의 인식을 수치화하여, 이 data를 바탕으로 특정 인물에 대한 평판을 알아보기 위한 수단으로 활용하고자 한다.


(2) Understanding the Problem

1) 요구사항 분석
  포털 사이트의 인명검색을 활용한 웹 페이지(Raw Data)를 크롤링 하고, 정제 과정을 거친다. 설문조사를 위한 웹 페이지를 제작하며, 설문 조사를 통해 얻은 결과를 저장 및 분석할 수 있도록 하는 데이터베이스를 구축한다. 수집된 데이터를 바탕으로 긍정/부정의 정도를 나타내주는 감정사전을 작성한다. 새로운 text를 바탕으로, 공인에 대한 긍정/부정을 판단할 수 있는 모델을 정하고 이를 평가한다.

2) 가정
검색 키워드 및 수집하는 웹 페이지는 편향되지 않으며, 무작위로 선정한다.
설문조사를 수행함에 있어서, 불특정다수의 응답자는 성실하며, 이성적으로 답변한다. 


3) Risk & Constraints
시간 및 홍보의 부족으로 인해 충분한 량의 설문조사 결과 수집이 어려울 수 있다. 
단어 그 자체로 긍정/부정을 단정하기는 쉽지 않으며, 문맥에 따라 의미가 달라질 수 있다.
수집된 웹 페이지가, 대중들의 의견을 반영하지 않을 수 있다.(홍보성 기사 등)


(3) Data mining goals and success criteria
1) goals

2) Success Criteria


(4) Project plan
1) 역할분담

2)Project Timeline









2. Data Understanding
(1) Exploratory Data Analysis
/*
자료의 유형을 탐구하고, 그 범위, 수준, 의미를 고찰하고, 그래프를 그리고, 변형시킨다.
*/






3. Data Preparation

(1) Data Cleaning & Pre-Processing
  웹 페이지의 텍스트에 대하여, 명사의 경우 함께 쓰인 조사를 분리하고, 동사에서는 어근과, 어미를 분리하는 작업을 수행한다. 독립적인 의미를 가지지 않는 단어(접속사 등)를 제거한다.
data set의 단어를 선정함에 있어서, 유사한 의미를 내포하고 있으나, 다르게 표현된 단어는 한 개의 대표 단어로 통합한다. dataset을 웹 database 형태로 저장한다.

(2) Detail






4. Modeling
(1) Model & Algorithm description

// 여러 모델을 설정하고, 각각을 비교할 수 있다.
// 모델의 parameter를 어떻게 정할 것인가?










5. Evaluation

(1) Analyze the result


(2) novels, unique findings, pattern, insights you revealed



(3) The results of your model meet the goals you established



(4) Evaluate and validate the model.





6. 참고문헌

한국어 자연어처리 : KoNLPy : KoNLPY
