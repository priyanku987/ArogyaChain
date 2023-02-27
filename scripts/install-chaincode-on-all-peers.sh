function usage {
    echo 'USAGE:  ./install-chaincode-on-all-peers.sh  PACKAGED_CHAINCODE_PATH'
}


if [ -z $1 ];
then
    usage
    echo "Please provide the PACKAGED_CHAINCODE_PATH!!!"
    exit 0
else
    PACKAGED_CHAINCODE_PATH=$1
fi



#For Mohfw peers
echo "Starting chaincode installation for Mohfw..."
echo "setting env variables..."
export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="MohfwMSP"
export CORE_PEER_MSPCONFIGPATH=/home/priyanku/Desktop/major-project/ArogyaChain/client/mohfw/admin/msp
echo "setting env variables for mohfw-anchor-peer..."
export CORE_PEER_ADDRESS=localhost:49153
source set-env.sh mohfw admin 49152
source set-identity.sh mohfw mohfw-anchor-peer
echo "installing chaincode on mohfw-anchor-peer ..."
../bin/peer lifecycle chaincode install $PACKAGED_CHAINCODE_PATH
echo "setting env variables for mohfw-peer1 ..."
export CORE_PEER_ADDRESS=localhost:50000
source set-env.sh mohfw admin 49999
source set-identity.sh mohfw mohfw-peer1
echo "installing chaincode on mohfw-peer1 ..."
../bin/peer lifecycle chaincode install $PACKAGED_CHAINCODE_PATH



#For hosp1 peers
echo "Starting chaincode installation for hosp1..."
echo "setting env variables..."
export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="Hosp1MSP"
export CORE_PEER_MSPCONFIGPATH=/home/priyanku/Desktop/major-project/ArogyaChain/client/hosp1/admin/msp
echo "setting env variables for hosp1-anchor-peer..."
export CORE_PEER_ADDRESS=localhost:51000
source set-env.sh hosp1 admin 50999
source set-identity.sh hosp1 hosp1-anchor-peer
echo "installing chaincode on hosp1-anchor-peer ..."
../bin/peer lifecycle chaincode install $PACKAGED_CHAINCODE_PATH

echo "setting env variables for hosp1-peer1 ..."
export CORE_PEER_ADDRESS=localhost:52000
source set-env.sh hosp1 admin 51999
source set-identity.sh hosp1 hosp1-peer1
echo "installing chaincode on hosp1-peer1 ..."
../bin/peer lifecycle chaincode install $PACKAGED_CHAINCODE_PATH




#For hosp2 peers
echo "Starting chaincode installation for hosp2..."
echo "setting env variables..."
export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="Hosp2MSP"
export CORE_PEER_MSPCONFIGPATH=/home/priyanku/Desktop/major-project/ArogyaChain/client/hosp2/admin/msp
echo "setting env variables for hosp2-anchor-peer..."
export CORE_PEER_ADDRESS=localhost:53000
source set-env.sh hosp2 admin 52999
source set-identity.sh hosp2 hosp2-anchor-peer
echo "installing chaincode on hosp2-anchor-peer ..."
../bin/peer lifecycle chaincode install $PACKAGED_CHAINCODE_PATH

echo "setting env variables for hosp2-peer1 ..."
export CORE_PEER_ADDRESS=localhost:54000
source set-env.sh hosp2 admin 53999
source set-identity.sh hosp2 hosp2-peer1
echo "installing chaincode on hosp2-peer1 ..."
../bin/peer lifecycle chaincode install $PACKAGED_CHAINCODE_PATH