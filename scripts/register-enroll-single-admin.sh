#!/bin/bash
# Registers the 3 admins
# mohfw-admin, hospa-admin, orderer-admin

function usage {
    echo 'USAGE:  ./register-enroll-user.sh  NAME PASSWORD AFFILIATION FULL_NAME PHONE_NUMBER_WITH_COUNTRY_CODE DOB MSPID'
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

if [ -z "$4" ];
then
    usage
    echo "Please provide the FULL NAME!!!"
    exit 0
else
    FULL_NAME="$4"
fi

if [ -z $5 ];
then
    usage
    echo "Please provide the PHONE NUMBER WITH COUNTRY CODE!!!"
    exit 0
else
    PHONE_NUMBER_WITH_COUNTRY_CODE=$5
fi

if [ -z $6 ];
then
    usage
    echo "Please provide the DOB!!!"
    exit 0
else
    DOB=$6
fi

if [ -z $7 ];
then
    usage
    echo "Please provide the MSPID!!!"
    exit 0
else
    MSPID=$7
fi


# Registers the admins
function registerAdmins {
    # 1. Set the CA Server Admin as FABRIC_CA_CLIENT_HOME
    source setclient.sh   ca-server   admin

    # 2. Register mohfw-admi
    echo "Registering: admin"
    ATTRIBUTES='"hf.Registrar.Roles=peer,user,client,orderer","hf.AffiliationMgr=true","hf.Revoker=true","hf.Registrar.Attributes=*","FULL_NAME=PRAVESH_SUKUMAR:ecert","PHONE_NUMBER=+913345678902:ecert","DOB=12-01-1987:ecert","MSPID=MohfwMSP:ecert","PATIENT=true:ecert","ADMIN=true:ecert","DOCTOR=false:ecert"'
    ../bin/fabric-ca-client register --id.type client --id.name $NAME --id.secret $PASSWORD --id.affiliation $AFFILIATION --id.attrs $ATTRIBUTES
}

# Setup MSP
function setupMSP {
    mkdir -p $FABRIC_CA_CLIENT_HOME/msp/admincerts

    echo "====> $FABRIC_CA_CLIENT_HOME/msp/admincerts"
    cp $FABRIC_CA_CLIENT_HOME/../../ca-server/admin/msp/signcerts/*  $FABRIC_CA_CLIENT_HOME/msp/admincerts
}

# Enroll admin
function enrollAdmins {
    # 1. mohfw-admin
    echo "Enrolling: mohfw-admin"

    ORG_NAME=$AFFILIATION
    source setclient.sh   $ORG_NAME   $NAME
    checkCopyYAML
    ../bin/fabric-ca-client enroll -u http://$NAME:$PASSWORD@localhost:7054

    setupMSP

    
}

# If client YAML not found then copy the client YAML before enrolling
# YAML picked from setup/config/multi-org-ca/yaml.0/ORG-Name/*
function    checkCopyYAML {
    SETUP_CONFIG_CLIENT_YAML="../../setup/config/multi-org-ca/yaml.0"
    if [ -f "$FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml" ]
    then 
        echo "Using the existing Client Yaml for $ORG_NAME  admin"
    else
        echo "Copied the Client Yaml from $SETUP_CONFIG_CLIENT_YAML/$ORG_NAME "
        mkdir -p $FABRIC_CA_CLIENT_HOME
        cp  "$SETUP_CONFIG_CLIENT_YAML/$ORG_NAME/fabric-ca-client-config.yaml" "$FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml"
    fi
}

echo "========= Registering ==============="
registerAdmins
echo "========= Enrolling ==============="
enrollAdmins
echo "==================================="