#First argument when calling this script on cli is the frontend server file
frontend=$1

#Call on inputServer.js to make changes on specified frontend server
node inputServer $frontend
cp -f "ecosystem.config.js" ./$frontend/

#Delete any pm2 processes called frontend_server. Our goal is to rest
echo "" > pm2Delete.txt
pm2 delete "frontend_server"

#Run the new frontend server
cd $frontend
npm install --verbose
pm2 start -f ecosystem.config.js
cd ..
