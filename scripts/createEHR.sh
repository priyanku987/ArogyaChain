#Launching peers of mohfw
echo "Launching peers of Mohfw..."
echo "setting env variables with Mohfw admin..."
source set-env.sh mohfw admin 49152
echo "setting anchor peer identity..."
source set-identity.sh mohfw demodoctor


../bin/peer chaincode invoke -o localhost:7050 -C arogyaehrchannel -n medicalRecordSimpleldb_1_0 --peerAddresses localhost:49153 -c '{"Args":["CreateMedicalRecord","7839j445kowe","PRESCRIPTION","demouser2","demodoctor","demodoctor","Demo Doctor","234567","44444","1st Hospital","444444","demodoctor","demodoctor","demouser2","1st patient","20","Golaghat","India","Assam","Golaghat","Golaghat","Khongia","785614","xxxxx","[]","1st attendant","father","Clorea","heh","low","[]","eat healthy","[]"]}'