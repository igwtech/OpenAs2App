#!/bin/bash
set -e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
rm -rf *.lock
cd $SCRIPT_DIR/..
docker build --build-arg VUE_APP_ROOT_API='https://as2.greicodex.com/api' \
             --build-arg VUE_APP_HIDDEN_SERVER=true \
             -f Dockerfile_WebUI -t openas2/webui .
id=$(docker create openas2/webui)
docker cp $id:/usr/share/nginx/html - | gzip > openas2-webui.tar.gz
docker rm -v $id
scp openas2-webui.tar.gz root@as2.greicodex.com:~/
rm -f openas2-webui.tar.gz
ssh root@as2.greicodex.com "cd /var/www/ && rm -rf html/{css,js} && tar -xzvf ~/openas2-webui.tar.gz"
cd $SCRIPT_DIR


