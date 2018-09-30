#!/bin/bash
echo "**********************************tar wap begin *************************************"
#cd /root/.jenkins/workspace/hushenlc-dev-ui-h5/default
rm -rf wap.tar.gz
cd ..
chmod 755 default -R
cd default
tar --exclude .git --exclude bin -czvf wap.tar.gz .
echo "**********************************tar wap end *************************************"