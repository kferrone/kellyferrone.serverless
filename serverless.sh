#!/usr/bin/env bash

export NODE_RUNTIME=${NODE_RUNTIME:=nodejs6}

preInstall() {
	mkdir -p ./env
}

pushFX() {
	local cloudFX=$1
	shift
	gcloud functions deploy $cloudFX --runtime $NODE_RUNTIME $@
}

viewFxLogs() {
	gcloud functions logs read --limit 100
}

sayHello() {
	echo "Hello Cloud FX! $(getBucketName) Is the bucket name.";
}

getBucketName() {
	node -e "console.log(require('./config.json').EVENT_BUCKET);"
}

sendEmail() {
	curl -X POST "https://${GCLOUD_REGION}-${GCLOUD_PROJECT}.cloudfunctions.net/sendgridEmail" \
		--data '{"from":"kelly@slconnected.com","subject":"Hello from Sendgrid!","body":"Hello World! I am ready now :D"}' \
		--header "Content-Type: application/json"	
}

sendEmailTest() {
	echo "{$(jsonKV to $1),$(jsonKV from $2),$(jsonKV subject $3),$(jsonKV body $4)}"
}

jsonKV() {
	local dqt='"'
	echo "${dqt}${1}${dqt}:${dqt}${2}${dqt}"	
}

loadFirebaseConfig() {
    cat ./src/.runtimeconfig.json | node ./bin/firebaseConfigLoader.js
}

$@