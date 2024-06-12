#!/bin/bash

source variable.sh

# Create S3 bucket
aws s3api create-bucket --bucket $LAMBDA_FUNCTION_BUCKET_NAME --region us-east-1

# Upload the three zip files
aws s3 cp $FOLDER/readFromDB.zip s3://$LAMBDA_FUNCTION_BUCKET_NAME/

# Create the stack
aws cloudformation create-stack --stack-name $STACK_NAME \
    --template-body file://$TEMPLATE_FILE \
    --region us-east-1 \
    --parameters ParameterKey=LambdaBucket,ParameterValue="${LAMBDA_FUNCTION_BUCKET_NAME}" \
            ParameterKey=RepositoryURL,ParameterValue="${REPOSITORY_URL}" \
            ParameterKey=ConvertedBucketName,ParameterValue="${FUNCTION_NAME}" \
            ParameterKey=DBNAME,ParameterValue="${DB_NAME}" \
            ParameterKey=DBHOSTNAME,ParameterValue="${DB_HOSTNAME}" \
            ParameterKey=DBCRED,ParameterValue="${DB_CRED}" \
            ParameterKey=DBUSER,ParameterValue="${DB_USER}" \
            ParameterKey=DBPORT,ParameterValue="${DB_PORT}" \
    --capabilities CAPABILITY_NAMED_IAM


# Wait for the stack to be created
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME

# Get the Amplify App ID
APP_NAME="Chef-With-You"

MAX_RETRIES=10
RETRY_COUNT=0

while [[ -z "$APP_ID" && $RETRY_COUNT -lt $MAX_RETRIES ]]; do
  APP_ID=$(aws amplify list-apps --query "apps[?name=='$APP_NAME'].appId" --output text)
  if [[ -z "$APP_ID" ]]; then
    printf "Waiting for APP_ID ready..... Retrying in 10 seconds."
    for i in {1..10}; do
      printf "."
      sleep 1
    done
    RETRY_COUNT=$((RETRY_COUNT+1))
  fi
done

if [[ -z "$APP_ID" ]]; then
  echo "Failed to get APP_ID after $MAX_RETRIES retries. Exiting."
  exit 1
fi


# Get the branch name
BRANCH_NAME="master"

sleep 10
# Start the build job
aws amplify start-job \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH_NAME" \
  --job-type "RELEASE" 




# Delete the three zip files from the S3 bucket
aws s3 rm s3://$LAMBDA_FUNCTION_BUCKET_NAME/readFromDB.zip

# Delete the S3 bucket
aws s3api delete-bucket --bucket $LAMBDA_FUNCTION_BUCKET_NAME
echo "Bucket $LAMBDA_FUNCTION_BUCKET_NAME has been Deleted."

# Print a message indicating that the stack has been created
echo "Stack $STACK_NAME has been created."