#!/usr/bin/env bash

set -o nounset

catch(){
    local msg="$*"
    echo "${msg}" >&2
    exit 1
}

main(){
    docker build --no-cache . -t website
    docker run -it -p 8080:80 --name website website
    docker rm -f website
    docker rmi -f website
}

# ENTRYPOINT
trap 'catch "An error occurred on line ${LINENO}."' ERR
main
