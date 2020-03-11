#The first argument when the scipt is called will be the backend folder refered
backend=$1

#Delete any load_config or server processes on pm2. Our goal is to reset the
#backend server processes
echo "" > pm2Delete.txt
pm2 delete "load_config"
pm2 delete "server"

#Run the backend server by making pm2 call the updated ecosystem.config.js file
cd $backend
sudo npm install --verbose
sudo npm rebuild
pm2 start -f ecosystem.config.js
cd ..

#Reset nginx to adhere changes
sudo service nginx restart
