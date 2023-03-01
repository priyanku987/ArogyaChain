#Launching peers of mohfw
echo "Launching peers of Mohfw..."
echo "setting env variables with Mohfw admin..."
source set-env.sh mohfw admin 49152
echo "setting anchor peer identity..."
source set-identity.sh mohfw mohfw-anchor-peer


../bin/peer chaincode invoke -o localhost:7050 -C arogyaehrchannel -n accessControl_1_6 --peerAddresses localhost:49153 -c '{"Args":["CreateMedicalRecord","uue6838","PRESCRIPTION","1234567","22345","22345","1st Doctor","234567","44444","1st Hospital","444444","22345","22345","1234567","1st patient","\"20"\","Golaghat","India","Assam","Golaghat","Golaghat","Khongia","785614","xxxxx","[]","1st attendant","father","Clorea","heh","low","[]","eat healthy","[]"]}'
p