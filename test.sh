#!/usr/bin/env bash

set -o pipefail
set -o errtrace

log(){
    header="[$(date -Iseconds)][${BASH_SOURCE[0]}]"
    while [[ $# -gt 0 ]]; do
        option=${1}
        case $option in
            -d|--debug)
                echo "${header}[DEBUG] ${2}"
                ;;
            -i|--info)
                echo "${header}[INFO] ${2}"
                ;;
            -w|--warn)
                echo "${header}[WARN] ${2}" >&2
                ;;
            -e|--error)
                echo "${header}[ERROR] ${2}" >&2
                ;;
            -c|--critical)
                echo "${header}[CRIT] ${2}" >&2
                ;;
        esac
    done
}

catch(){
    log -e $1
    exit 1
}

main(){
    docker build -t website . 
    docker run -it -p 8080:80 --name website website
    docker rm website
}

# ENTRYPOINT
trap 'catch "An error occurred on line ${LINENO}."' ERR
main
