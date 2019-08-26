#Allocates 4G of ram by making space in the harddisk
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

#Configures OS to adhere to this allocation by appending to /etc/fstab
echo "/swapfile       none    swap    sw      0       0">> /etc/fstab
reboot now
