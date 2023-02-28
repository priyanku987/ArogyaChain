function usage {
    echo "./all-commit-chaincode-definition.sh   CHAINCODE_NAME CHAINCODE_VERSION SEQUENCE_NUMBER"
}

if [ -z $1 ];
then
    usage
    echo "Please provide the CHAINCODE_PACKAGE_ID!!!"
    exit 0
else
    CHAINCODE_NAME=$1
fi

if [ -z $2 ];
then
    usage
    echo "Please provide the CHAINCODE_PACKAGE_ID!!!"
    exit 0
else
    CHAINCODE_VERSION=$2
fi

if [ -z $3 ];
then
    usage
    echo "Please provide the CHAINCODE_PACKAGE_ID!!!"
    exit 0
else
    SEQUENCE_NUMBER=$3
fi

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
../bin/peer lifecycle chaincode commit -o localhost:7050 --channelID arogyaehrchannel --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --sequence $SEQUENCE_NUMBER --cafile "/home/priyanku/Desktop/major-project/ArogyaChain/client/orderer/msp/cacerts/ca-cert.pem" --peerAddresses localhost:49153 --peerAddresses localhost:50000 --peerAddresses localhost:51000 --peerAddresses localhost:52000 --peerAddresses localhost:53000 --peerAddresses localhost:54000
