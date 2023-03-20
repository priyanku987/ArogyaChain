#!/bin/bash
# Registers the 3 admins
# mohfw-admin, hospa-admin, orderer-admin

function usage {
    echo 'USAGE:  ./register-enroll-user.sh  NAME PASSWORD AFFILIATION'
}

if [ -z $1 ];
then
    usage
    echo "Please provide the NAME!!!"
    exit 0
else
    NAME=$1
fi

if [ -z $2 ];
then
    usage
    echo "Please provide the PASSWORD!!!"
    exit 0
else
    PASSWORD=$2
fi

if [ -z $3 ];
then
    usage
    echo "Please provide the AFFILIATION!!!"
    exit 0
else
    AFFILIATION=$3
fi

# Registers the admins
function registerPatient {
    # 1. Set the CA Server Admin as FABRIC_CA_CLIENT_HOME
    source setclient.sh mohfw admin2

    # 2. Register user
    echo "Registering: patient"
    ATTRIBUTES='patient=true:ecert'
    ../bin/fabric-ca-client register --id.type client --id.name $NAME --id.secret $PASSWORD --id.affiliation $AFFILIATION --id.attrs $ATTRIBUTES    
}


# Enroll patient
function enrollPatient {
    echo "Enrolling: patient"

    ORG_NAME=$AFFILIATION
    source setclient.sh $ORG_NAME $NAME
    #checkCopyYAML
    ../bin/fabric-ca-client enroll -u http://$NAME:$PASSWORD@localhost:7054
}



echo "========= Registering ==============="
registerPatient
echo "========= Enrolling ==============="
enrollPatient
echo "==================================="