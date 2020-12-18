library(rvest)
library(xml2)
library(tidyverse)
library(stringr)
library(lubridate)
library(magrittr)
library(rio)

htm_filenames <- dir("~/Desktop/R-projects/2030_report/from_cpse/ZUIP/", full.names = FALSE)
htm_files <- dir("~/Desktop/R-projects/2030_report/from_cpse/ZUIP/", full.names = TRUE)

setwd("~/Desktop/R-projects/2030_report/xml_output/")

for(i in 1:length(htm_filenames)){
  htm_filenames[i] <- gsub(".htm", "", htm_filenames[i])
}

for(i in 1:length(htm_files)){

  rawHTML <- paste(readLines(htm_files[i]), collapse="\n")
    
  
  # After reading the raw HTML you can use the below to read the tables:
  
  file <- read_html(rawHTML)
  
  # More general extract
  # tables <- html_nodes(file, "font") %>% html_text(trim = TRUE)
  
  tables <- html_nodes(file, "nobr") %>% html_text(trim = TRUE)
  
  tables <- as.data.frame.vector(tables, nm = paste(deparse(substitute(extract))))
  
  meters <- which(str_detect(tables$extract, "Meter"))
  
  for(x in 1:length(meters)){
    meters[x] <-  meters[x] + 1
  }
  
  meters <- unique(tables[meters,])
  
  tables %<>%
    mutate(meter = str_extract(extract, paste0(meters[1], "|", meters[2])))
  
  tables$meter <- zoo::na.locf(tables$meter, na.rm = FALSE)
  
  tables %<>%
    filter(str_detect(extract, "../../...."))
  
  tables$extract <- gsub(",", "", tables$extract)
  
  
  tables[1,1] <- gsub("\\s+", ",", gsub("^\\s+|\\s+$", "", tables[1,1]))
  
  for(y in 2:nrow(tables)){
    
    tables[y,1] <- gsub("\\s+", ",", gsub("^\\s+|\\s+$", "", tables[y,1]))
    
  }
  
  # split tables by meter
  # save file with meter name
  
  tables_split <- split(tables, tables$meter)
  
  for(metert in tables_split){
    file_name <- metert$meter[1]
    metert <- separate(data = metert, col = c("extract"), into = c("date", "consumption", "days", "avg_cons", "amount", "actual_demand", "billing_demand", "read_reason"), sep = (","))
  
    metert %<>%
      select(date, days, amount, consumption) %>%
      rename("endDate" = date, "usage" = consumption, "cost" = amount) %>% 
      mutate(endDate = mdy(endDate)) %>% 
      mutate(startDate = endDate-as.numeric(days)) %>%
      mutate(startDate = format(startDate,"%Y-%m-%d"), endDate = format(endDate,"%Y-%m-%d")) %>% 
      select(-days)
    
    # export(metert, paste0(file_name,".xml"))  
    
    oldXML <- read_xml("<meterData></meterData>")
    vars_xml <- lapply(purrr::transpose(metert),
                       function(x) {
                         as_xml_document(list(meterConsumption = lapply(x, as.list)))
                       })
    
    for(meter in vars_xml) xml_attr(meter,"estimatedValue") <- "false"
    for(meter in vars_xml) xml_add_child(oldXML, meter)
    
    write_xml(oldXML,paste0(file_name,".xml"))
    
    # validate the created files against xml schema
    doc <- read_xml(paste0(file_name,".xml"), package = "xml2")
    schema <- read_xml("../portfoliomanager-schemas-15.0/meter/meterConsumptionData.xsd", package = "xml2")
    xml_validate(doc, schema)
  
  }

   
  # tables <- separate(data = tables, col = c("extract"), into = c("date", "consumption", "days", "avg_cons", "amount", "actual_demand", "billing_demand", "read_reason"), sep = (","))
  # 
  # tables %<>%
  #   select(date, days, amount, consumption) %>%
  #   mutate(endDate = chron::dates(date)-as.numeric(days)) %>%
  #   rename("startDate" = date, "usage" = consumption, "cost" = amount)
  # 
  # export(tables, paste0(htm_filenames[i],".xml"))
    
}

