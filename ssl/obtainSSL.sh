domain=$1
sudo certbot --nginx -d $1 
sudo systemctl reload nginx
