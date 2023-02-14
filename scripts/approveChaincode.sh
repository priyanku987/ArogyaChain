function usage {
    echo 'USAGE:  ./approveChaincode.sh  CHAINCODENAME VERSION'
}


if [ -z $1 ];
then
    usage
    echo "Please provide the CHAINCODENAME!!!"
    exit 0
else
    CHAINCODENAME=$1
fi

if [ -z $2 ];
then
    usage
    echo "Please provide the VERSION!!!"
    exit 0
else
    VERSION=$2
fi




../bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --channelID arogyaehrchannel --name $CHAINCODENAME --version $VERSION.0 --package-id $CC_PACKAGE_ID --sequence 2 --cafile "/home/priyanku/Desktop/major-project/ArogyaChain/client/orderer/admin/msp/cacerts/localhost-7054.pem"
