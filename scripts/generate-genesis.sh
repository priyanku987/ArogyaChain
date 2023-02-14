# Generates the orderer | generate genesis block for ordererchannel
# export ORDERER_GENERAL_LOGLEVEL=debug
export FABRIC_LOGGING_SPEC=INFO
export FABRIC_CFG_PATH="/home/priyanku/Desktop/major-project/ArogyaChain"

# Create the Genesis Block
echo    '================ Writing Genesis Block ================'
../bin/configtxgen -profile ArogyaChainOrdererGenesis -outputBlock ../arogya-ehr-genesis.block -channelID ordererchannel
