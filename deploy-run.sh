#!/bin/bash
app_root=$(dirname $(readlink -f $0))
# git pull for update repo
cd "$app_root"
rm -rf ./node_modules #purge already installed dependecy
git pull

# install dependencies
cd "$app_root"
npm install # create venv

# run program
pm2 reload chat-node-agent # chat-node-agent is appname named with pm2 start app.js --name chat-node-agent
