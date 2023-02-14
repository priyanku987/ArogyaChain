# Generates the orderer | generate the airline channel transaction

# export ORDERER_GENERAL_LOGLEVEL=debug
export FABRIC_LOGGING_SPEC=INFO
export FABRIC_CFG_PATH=$PWD/../

function usage {
    echo "./generate-channel-tx.sh "
    echo "     Creates the mrNetChannel.tx for the channel mrnetchannel"
}

echo    '================ Writing airlinechannel ================'

../bin/configtxgen -profile ArogyaEhrChannel -outputCreateChannelTx ../arogyaEhrChannel.tx -channelID arogyaehrchannel



echo    '======= Done. Launch by executing orderer ======'
