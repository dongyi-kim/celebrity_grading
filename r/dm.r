install.packages("RMySQL")
install.packages("plyr")
library(RMySQL)
library(plyr)
Sys.setenv("plotly_username"="clacis91")
Sys.setenv("plotly_api_key"="oYTo6pz0Zw8YnT0sYgqu")

con <- dbConnect(MySQL(), user="datamining", password="dm2016", dbname="celebrity_grading", host="codingmonster.net", port=3306)

dbListTables(con)
dbListFields(con, "words")

dbGetQuery(con, "select count(*) from words")

words <- dbReadTable(con, "words")
dbDisconnect(con)

Encoding(words$word) <- "UTF-8"

sort <- arrange(words, desc(mentioned))
sort_head <- head(sort, 10)

barplot(words$mentioned, main="Mentioned", horiz=TRUE, names.arg = words$word)
barplot(sort_head$mentioned, main="Mentioned", horiz=TRUE, names.arg = sort_head$word, cex.names=2)

#aa <- data.frame(words[c("word")], words[c("mentioned")] )

#mentioned <- data.frame(word = words.word, mention = words.mentioned)

# 작업 : x_stats
#dbWriteTable(con, value = read_stats, name = "scores", append = TRUE)