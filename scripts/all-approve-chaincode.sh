function usage {
    echo "./all-approve-chaincode.sh   CHAINCODE_PACKAGE_ID"
}

# Org name Must be provided
if [ -z $1 ];
then
    usage
    echo "Please provide the CHAINCODE_PACKAGE_ID!!!"
    exit 0
else
    CHAINCODE_PACKAGE_ID=$1
fi

export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="MohfwMSP"
export CORE_PEER_MSPCONFIGPATH=/home/priyanku/Desktop/major-project/ArogyaChain/client/hosp2/admin/msp
#export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:49153


#For Mohfw
echo "Using 'ANY' approval policy so starting approve process with only one ORG..."
echo "Switching to admin identity for Mohfw..."
echo "Setting env variables to operate as admin..."
source set-env.sh mohfw admin
echo "setting identity..."
source set-identity.sh mohfw admin
echo "Performing approval operation for installing chaincode for mohfw.."
#NOTE: the cafile path needs to be changed according to the system where it will be operated
#NOTE: chaincode name and version needs to be replaced
../bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --channelID arogyaehrchannel --name medicalRecord-2 --version 1.2 --package-id $CHAINCODE_PACKAGE_ID --sequence 3 --cafile "/home/priyanku/Desktop/major-project/ArogyaChain/client/orderer/admin/msp/cacerts/localhost-7054.pem"

