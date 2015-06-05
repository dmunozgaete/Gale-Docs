#!/bin/sh

SSH_USER="valentys_user"
SSH_SERVER="rfundme.cloudapp.net"
SERVER_FOLDER="/var/www/"
SSH_KEY_FILE="ssh_server/rfundme-cloudapp-net.key"

#FIRST: ZIP IN ONE FILE THE API TO TRANSPORT TO SERVER
zip -r api.zip api  -x "*/\.DS_Store"

ssh -i $SSH_KEY_FILE $SSH_USER@$SSH_SERVER -p 22 'rm /var/www/api -R'
sudo scp -i $SSH_KEY_FILE -r api.zip sudo $SSH_USER@$SSH_SERVER:$SERVER_FOLDER
ssh -i $SSH_KEY_FILE $SSH_USER@$SSH_SERVER -p 22 "unzip /var/www/api.zip -d /var/www/"

ssh -i $SSH_KEY_FILE $SSH_USER@$SSH_SERVER -p 22
#ssh server -t "cd /var/wwww/api'; bash --login"


