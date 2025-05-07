

#!/bin/bash
###
# Params 1: current version
# Params 2: next version

printf "Deploy version:\n "
read -p "" currentVersion

if [ "$currentVersion" != "" ] ; then
   appcenter codepush release-react -a thenguyenfiner-gmail.com/MeetGo-App -d Staging -t ${currentVersion}
else 
    echo "do nothing"
fi