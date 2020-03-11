folder=$1

cd $folder
pm2 restart ecosystem.config.js
