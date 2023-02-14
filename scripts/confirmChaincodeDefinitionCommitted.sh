function usage {
    echo 'USAGE:  ./confirmChaincodeInstallation.sh  CHAINCODENAME'
}


if [ -z $1 ];
then
    usage
    echo "Please provide the CHAINCODENAME!!!"
    exit 0
else
    CHAINCODENAME=$1
fi



../bin/peer lifecycle chaincode querycommitted --channelID arogyaehrchannel --name $CHAINCODENAME --cafile "/home/priyanku/Desktop/major-project/ArogyaChain/client/orderer/admin/msp/cacerts/localhost-7054.pem"
