#!/bin/sh

SSH_USER="valentys_user"
SSH_SERVER="rfundme.cloudapp.net"
SERVER_FOLDER="/var/www/"
SSH_KEY_FILE="ssh_server/rfundme-cloudapp-net.key"

ssh -i $SSH_KEY_FILE $SSH_USER@$SSH_SERVER -p 22

cd $SERVER_FOLDER

