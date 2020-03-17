#!/bin/bash

#Save developer-specific information
domain=$1
ipAddress=`wget http://ipecho.net/plain -O - -q ; echo`

#Create main configuration file
#Note: We do not touch defualt incase we need it in the future. 
#Note: 'main' is identifier for our configuration file. Could be anything 
configFileName="main"
configFile="/etc/nginx/sites-available/$configFileName"
touch $configFile
echo $configFile

#Append 
server_code="server {
        #listen 80 default_server;
        #listen [::]:80 default_server;
	#listen 80;
	listen 443 default_server ssl;
	#listen [::]:443 default_server;

	server_name markdalefinancial.ca;
	add_header 'Access-Control-Allow-Origin' '*' always;
	
	#ssl on;
	ssl_certificate ./;
	ssl_certificate_key ./;

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;
	ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';        
	
	if (\$server_port = 80) {
	rewrite ^/(.*)$ https://$domain/\$1 permanent;
	}

	# SSL configuration
        #...
        #root /var/www/build;
        #index index.html index.htm;
	root /var/www/build;
        index index.php index.html index.htm index.nginx-debian.html;
        location  ^~/backend {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host \$host;
                proxy_cache_bypass \$http_upgrade;
        }
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                root /usr/share/;
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        }
	location ^~/phpmyadmin {
           root /var/www/html/;
           index index.php index.html index.htm;
           location ~ ^/phpmyadmin/(.+\.php)$ {
                   try_files \$uri =404;
                   root /usr/share/;
                   fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
                   fastcgi_index index.php;
                   fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
                   include /etc/nginx/fastcgi_params;
           }
           location ~* ^/phpmyadmin/(.+\.(jpg|jpeg|gif|css|png|js|ico|html|xml|txt))$ {
                   root /usr/share/;
           }
    	}
        location ~ /\.ht {
                deny all;
        }
        location / { #When ip_address/dashboard is accessed display the index.html in the react/vue folder
                alias /var/www/build;
                try_files  \$uri \$uri/ /index.html =404;
	}
	location ~/(?:index.html)?$ {
   		root /var/www/build/;
    		index index.html;
	}
        location ^~ /static { #Open the css/index files for viewing
                alias /var/www/build/static;
                try_files \$uri =404;
        }
        location ^~ /frontend { #Host frontend on port 3001
                proxy_pass http://localhost:3001;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host \$host;
                proxy_cache_bypass \$http_upgrade;
        }
}
server {
	listen 80 default_server;
	server_name $ipAddress;
	return 301 $domain;
}
## To track where nginx is redirecting the path location ##
log_format requests    " \$request_filename ";
access_log /var/log/nginx/access.log requests;

"

# Replace NGINX config
echo "$server_code" > $configFile

#Create link in site-enabled so it can be accessed and unlink default
sudo ln -s $configFile /etc/nginx/sites-enabled/
sudo unlink /etc/nginx/sites-enabled/default

#Check if syntax is correct
sudo nginx -t

#Restart NGINX
sudo service nginx restart
sudo systemctl restart nginx
sudo systemctl reload nginx

