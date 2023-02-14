function usage {
    echo 'USAGE:  ./set-fabric-cfg-path.sh  ORG_NAME TYPE'
}


if [ -z $1 ];
then
    usage
    echo "Please provide the ORG Name!!!"
    exit 0
else
    ORG_NAME=$1
fi

if [ -z $2 ];
then
    usage
    echo "Please provide the TYPE!!!"
    exit 0
else
    TYPE=$2
fi

if [ $2 == 'ORDERER' ]
then
    export FABRIC_CFG_PATH="$PWD/../"
elif [ $2 == 'PEER' ]
then
    export FABRIC_CFG_PATH="$PWD/../client/$ORG_NAME"
else
    export FABRIC_CFG_PATH="$PWD/../"
fi