
backend=$1
#node inputBackend.js

node inputServer.js $1
cp -f "ecosystem.config.js" ./$backend/
