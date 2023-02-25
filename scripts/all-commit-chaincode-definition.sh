export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="MohfwMSP"
export CORE_PEER_MSPCONFIGPATH=/home/priyanku/Desktop/major-project/ArogyaChain/client/hosp2/admin/msp
#export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:49153


#For Mohfw
echo "Using 'ANY' commit policy so starting commit process with only one ORG..."
echo "Switching to admin identity for Mohfw..."
echo "Setting env variables to operate as admin..."
source set-env.sh mohfw admin
echo "setting identity..."
source set-identity.sh mohfw admin

#NOTE: ca file path needs to be replace according to the system in which it is executed
peer lifecycle chaincode commit -o localhost:7050 --channelID arogyaehrchannel --name medicalRecord-2 --version 1.2 --sequence 3 --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:49153 --peerAddress localhost:50000 --peerAddress localhost:51000 --peerAddress localhost:52000 --peerAddress localhost:53000 --peerAddress localhost:54000
