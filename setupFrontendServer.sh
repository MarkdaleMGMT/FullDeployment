frontend=$1

#Get public ip_address
#ip_address=`wget http://ipecho.net/plain -O - -q ; echo`
#echo $ip_address

#touch ./$1/config/components/mysql.js
#node inputFrontend.js ./$1/config/components/mysql

node inputServer $frontend
cp -f "ecosystem.config.js" ./$frontend/

echo "" > pm2Delete.txt
pm2 delete "frontend_server"

cd $frontend
sudo npm install --verbose
pm2 start -f ecosystem.config.js
cd ..

sudo service nginx restart
