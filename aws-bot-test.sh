# moderator & first 2 speakers
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws", "speakers": 2, "audience": 0, "noModerator": false, "timeoutMs": 120000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null

sleep 3
# 3 more speakers
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-1", "speakers": 3, "audience": 0, "noModerator": true, "timeoutMs": 100000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null

sleep 3
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-2", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 100000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-2a", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 100000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null

sleep 3
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-3", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 80000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-3a", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 80000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null

sleep 5
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-4", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 80000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-4a", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 80000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null

sleep 3
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-5", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 80000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-5a", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 80000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null

sleep 3
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-6", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 80000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null
# 20 audience
aws lambda invoke --function-name jam-bot --cli-binary-format raw-in-base64-out --invocation-type Event --payload \
'{"instanceId": "aws-6a", "speakers": 0, "audience": 20, "noModerator": true, "timeoutMs": 80000, "jamDomain": "jam.dev.plusepsilon.com", "sfu": true}' \
/dev/null
