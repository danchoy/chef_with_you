#!/bin/bash

# Create bucket for upload Lambda Funtion
LAMBDA_FUNCTION_BUCKET_NAME="chefwithyou-lambda-function"
FOLDER="LambdaFunction"

# Information to create stack
STACK_NAME="Chefwithyou"
TEMPLATE_FILE="chefwityou_stack.yaml"
REPOSITORY_URL="https://github.com/4620-2023-Group4/Chef-With-You.git"
# CONVERTED_BUCKET_NAME="graphic-gurus-converted-s3" 
FUNCTION_NAME="readFromDB" 
DB_NAME="my_database"
DB_HOSTNAME="database-1.ctzti4npulrl.us-east-1.rds.amazonaws.com"
DB_CRED="chefwithyou"
DB_USER="admin"
DB_PORT="3305"