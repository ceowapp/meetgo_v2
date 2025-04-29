

#!/bin/bash
###
# Params 1: current version
# Params 2: next version

printf "Deploy version:\n "
read -p "" currentVersion

if [ "$currentVersion" != "" ] ; then
   appcenter codepush release-react -a Meeto/MeetGo-IOS -d Staging -t ${currentVersion}
   appcenter codepush release-react -a Meeto/MeetGo-Android -d Staging -t ${currentVersion}
else 
    echo "do nothing"
fi