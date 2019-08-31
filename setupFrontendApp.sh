#The first argument when calling this script is the react folder to be deloploed
dashboardFolder=$1
ipAddress=`wget http://ipecho.net/plain -O - -q ; echo`

#Touch to check if config file exists. Call inputfrontend.js to configure config.js file
touch ./$dashboardFolder/src/config.js
node inputFrontend.js ./$dashboardFolder/src/config
#node consistentIP.js ./$dashboardFolder/src

echo "\n Building Produciton Build of $dashboardFolder \n"

cd $dashboardFolder
echo "" > "build.txt"
sudo npm install --verbose
sudo npm run build >> "build.txt"
cd ..

#Copy folder
sudo cp -r "./$dashboardFolder/build" "/var/www/"

#Restart NGINX
sudo service nginx restart
sudo systemctl restart nginx
sudo systemctl reload nginx

#Provide link address
#$LINK="$ipAddress"

echo "\n \n \n"
echo "Website up at:"
node getFrontendAppAddress.js
