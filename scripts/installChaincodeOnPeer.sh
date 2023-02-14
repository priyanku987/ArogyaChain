function usage {
    echo 'USAGE:  . installChaincodeOnPeer.sh  PEERLOCAlMSPID PEERMSPCONFIGPATH PEERADDRESS CHAINCODEPACKAGEWITHPATH'
}


if [ -z $1 ];
then
    usage
    echo "Please provide the PEERLOCAlMSPID!!!"
    exit 0
else
    PEERLOCAlMSPID=$1
fi

if [ -z $2 ];
then
    usage
    echo "Please provide the PEERMSPCONFIGPATH!!!"
    exit 0
else
    PEERMSPCONFIGPATH=$2
fi

if [ -z $3 ];
then
    usage
    echo "Please provide the PEERADDRESS!!!"
    exit 0
else
    PEERADDRESS=$3
fi

if [ -z $4 ];
then
    usage
    echo "Please provide the CHAINCODEPACKAGEWITHPATH!!!"
    exit 0
else
    CHAINCODEPACKAGEWITHPATH=$4
fi


export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID=$PEERLOCAlMSPID
export CORE_PEER_MSPCONFIGPATH=$PEERMSPCONFIGPATH
export CORE_PEER_ADDRESS=$PEERADDRESS

../bin/peer lifecycle chaincode install $CHAINCODEPACKAGEWITHPATH