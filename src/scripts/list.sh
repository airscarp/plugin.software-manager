#!/bin/bash

# CentOS
# IFS=: read -ra dirs_in_path <<< "$PATH"; for dir in "${dirs_in_path[@]}"; do for file in "$dir"/*; do [[ -x $file && -f $file ]] && printf '%s\n' "${file##*/}"; done; done

# Ubuntu
echo -e "dpkg-list\n";
sudo dpkg --list

# Exit
exit 0