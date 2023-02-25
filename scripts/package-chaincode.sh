function usage {
    echo 'USAGE:  . package-chaincode.sh  CHAINCODENAME VERSION LANG'
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

if [ -z $3 ];
then
    usage
    echo "Please provide the language!!!"
    exit 0
else
    LANG=$3
fi


export FABRIC_CFG_PATH="../"

../bin/peer lifecycle chaincode package $CHAINCODENAME-$VERSION.tar.gz --path ../chaincodes/$CHAINCODENAME/javascript/ --lang $LANG --label $CHAINCODENAME-$VERSION.0
