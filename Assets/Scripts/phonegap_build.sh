#!/bin/sh

PHONEGAP_FOLDER="Movil"

rm -R phonegap
rm -R phonegap.zip

#FIRST: ZIP IN ONE FILE THE API TO TRANSPORT TO SERVER
cp -R $PHONEGAP_FOLDER/www phonegap
cp -R $PHONEGAP_FOLDER/config.xml phonegap/config.xml
cp -R $PHONEGAP_FOLDER/res phonegap/res

cd phonegap

zip -r ../phonegap.zip *

cd ..

rm -R phonegap