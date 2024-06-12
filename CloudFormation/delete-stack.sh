#!/bin/bash

source variable.sh

# Empty the first bucket
aws s3 rm s3://$LAMBDA_FUNCTION_BUCKET_NAME --recursive

aws s3api delete-bucket --bucket $LAMBDA_FUNCTION_BUCKET_NAME

# Print a message indicating that the buckets have been emptied
echo "Buckets $LAMBDA_FUNCTION_BUCKET_NAME have been emptied."


# # Set the name of the stack to delete
# STACK_NAME="Chefwithyou"

# Delete the stack
aws cloudformation delete-stack --stack-name $STACK_NAME

# Wait for the stack to be deleted
aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME

# Print a message indicating that the stack has been deleted
echo "Stack $STACK_NAME has been deleted."