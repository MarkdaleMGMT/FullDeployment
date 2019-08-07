dashboardFolder=$1
ipAddress=`wget http://ipecho.net/plain -O - -q ; echo`

node inputFrontend.js ./$dashboardFolder/src/config

echo "\n Building Produciton Build of $dashboardFolder \n"

cd $dashboardFolder
echo "" > "build.txt"
sudo npm install
sudo npm run build >> "build.txt"
cd ..

#Copy folder
sudo cp -r "./$dashboardFolder/build" "/var/www/"

#Restart NGINX
sudo service nginx restart
sudo systemctl restart nginx
sudo systemctl reload nginx

#Provide link address
LINK="$ipAddress"

echo "\n \n \n"
echo "Website up at: \n$LINK\n"
