function usage {
    echo "./all-approve-chaincode.sh   CHAINCODE_PACKAGE_ID SEQUENCE_NUMBER CHAINCODE_NAME CHAINCODE_VERSION"
}

if [ -z $1 ];
then
    usage
    echo "Please provide the CHAINCODE_PACKAGE_ID!!!"
    exit 0
else
    CHAINCODE_PACKAGE_ID=$1
fi

if [ -z $2 ];
then
    usage
    echo "Please provide the CHAINCODE_PACKAGE_ID!!!"
    exit 0
else
    SEQUENCE_NUMBER=$2
fi

if [ -z $3 ];
then
    usage
    echo "Please provide the CHAINCODE_PACKAGE_ID!!!"
    exit 0
else
    CHAINCODE_NAME=$3
fi

if [ -z $4 ];
then
    usage
    echo "Please provide the CHAINCODE_PACKAGE_ID!!!"
    exit 0
else
    CHAINCODE_VERSION=$4
fi

export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="MohfwMSP"
export CORE_PEER_MSPCONFIGPATH=/home/priyanku/Desktop/major-project/ArogyaChain/client/mohfw/admin/msp
#export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:49153


#For Mohfw
echo "Using 'ANY' approval policy so starting approve process with only one ORG..."
echo "Switching to admin identity for Mohfw..."
echo "Setting env variables to operate as admin..."
source set-env.sh mohfw admin 49152
echo "setting identity..."
source set-identity.sh mohfw admin
echo "Performing approval operation for installing chaincode for mohfw.."
#NOTE: the cafile path needs to be changed according to the system where it will be operated
#NOTE: chaincode name and version needs to be replaced
../bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --cafile "/home/priyanku/Desktop/major-project/ArogyaChain/client/orderer/msp/cacerts/ca-cert.pem" --channelID arogyaehrchannel --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $CHAINCODE_PACKAGE_ID --sequence $SEQUENCE_NUMBER 



export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="Hosp1MSP"
export CORE_PEER_MSPCONFIGPATH=/home/priyanku/Desktop/major-project/ArogyaChain/client/hosp1/admin/msp
#export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:51000

#For Hosp1
echo "Using 'ANY' approval policy so starting approve process with only one ORG..."
echo "Switching to admin identity for Hosp1..."
echo "Setting env variables to operate as admin..."
source set-env.sh hosp1 admin 50999
echo "setting identity..."
source set-identity.sh hosp1 admin
echo "Performing approval operation for installing chaincode for hosp1.."
#NOTE: the cafile path needs to be changed according to the system where it will be operated
#NOTE: chaincode name and version needs to be replaced
../bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --cafile "/home/priyanku/Desktop/major-project/ArogyaChain/client/orderer/msp/cacerts/ca-cert.pem" --channelID arogyaehrchannel --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $CHAINCODE_PACKAGE_ID --sequence $SEQUENCE_NUMBER 




export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="Hosp2MSP"
export CORE_PEER_MSPCONFIGPATH=/home/priyanku/Desktop/major-project/ArogyaChain/client/hosp2/admin/msp
#export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:53000

#For Hosp2
echo "Using 'ANY' approval policy so starting approve process with only one ORG..."
echo "Switching to admin identity for Hosp2..."
echo "Setting env variables to operate as admin..."
source set-env.sh hosp2 admin 52999
echo "setting identity..."
source set-identity.sh hosp2 admin
echo "Performing approval operation for installing chaincode for hosp2.."
#NOTE: the cafile path needs to be changed according to the system where it will be operated
#NOTE: chaincode name and version needs to be replaced
../bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --cafile "/home/priyanku/Desktop/major-project/ArogyaChain/client/orderer/msp/cacerts/ca-cert.pem" --channelID arogyaehrchannel --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $CHAINCODE_PACKAGE_ID --sequence $SEQUENCE_NUMBER 
