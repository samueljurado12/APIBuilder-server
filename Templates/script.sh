#!/bin/bash
docker-compose -f files/ProjectName-compose.yml up -d
mysql -h "SERVER-NAME" -u "root" -p "ProjectName" < files/ProjectName-schema.sql
