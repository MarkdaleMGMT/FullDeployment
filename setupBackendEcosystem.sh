
backend=$1
#node inputBackend.js

#Configure a new ecosystem.config.js file and copy it to the backend folder provided
node inputServer.js $1
cp -f "ecosystem.config.js" ./$backend/
