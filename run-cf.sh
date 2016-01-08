#!/bin/bash

FILE="file://deploy.template"
STACK_NAME="lambda2"
# PARAMS="ParameterKey=BucketName,ParameterValue=lambda-dliggat"
OPERATION="${1:-update}-stack"

aws cloudformation ${OPERATION} \
--stack-name ${STACK_NAME} \
--template-body ${FILE} \
--capabilities CAPABILITY_IAM \
# --parameters ${PARAMS}
