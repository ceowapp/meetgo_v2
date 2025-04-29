

printf "Message deploy:\n "
read -p "" message
bundle exec fastlane ios build_dev message:"$message"
bundle exec fastlane android build_dev message:"$message"