#!/bin/bash
# Registers the 3 admins
# mohfw-admin, hospa-admin, orderer-admin

# Registers the admins
function registerAdmins {
    # 1. Set the CA Server Admin as FABRIC_CA_CLIENT_HOME
    source setclient.sh   ca-server   admin

    # 2. Register mohfw-admin
    echo "Registering: mohfw-admin"
    ATTRIBUTES='"hf.Registrar.Roles=peer,user,client,orderer","hf.AffiliationMgr=true","hf.Revoker=true"'
    ../bin/fabric-ca-client register --id.type client --id.name mohfw-admin --id.secret password --id.affiliation mohfw --id.attrs $ATTRIBUTES

    # 3. Register orderer-admin
    echo "Registering: orderer-admin"
    ATTRIBUTES='"hf.Registrar.Roles=orderer"'
    ../bin/fabric-ca-client register --id.type client --id.name orderer-admin --id.secret password --id.affiliation orderer --id.attrs $ATTRIBUTES

    # 4. Register hosp1-admin
    echo "Registering: hosp1-admin"
    ATTRIBUTES='"hf.Registrar.Roles=peer,user,client","hf.AffiliationMgr=true","hf.Revoker=true"'
    ../bin/fabric-ca-client register --id.type client --id.name hosp1-admin --id.secret password --id.affiliation hosp1 --id.attrs $ATTRIBUTES

    # 5. Register hosp2-admin
    echo "Registering: hosp2-admin"
    ATTRIBUTES='"hf.Registrar.Roles=peer,user,client","hf.AffiliationMgr=true","hf.Revoker=true"'
    ../bin/fabric-ca-client register --id.type client --id.name hosp2-admin --id.secret password --id.affiliation hosp2 --id.attrs $ATTRIBUTES

    # 6. Register hosp3-admin
    echo "Registering: hosp3-admin"
    ATTRIBUTES='"hf.Registrar.Roles=peer,user,client","hf.AffiliationMgr=true","hf.Revoker=true"'
    ../bin/fabric-ca-client register --id.type client --id.name hosp3-admin --id.secret password --id.affiliation hosp3 --id.attrs $ATTRIBUTES
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

    ORG_NAME="mohfw"
    source setclient.sh   $ORG_NAME   admin
    checkCopyYAML
    ../bin/fabric-ca-client enroll -u http://mohfw-admin:password@localhost:7054

    setupMSP

    # 2. orderer-admin
    echo "Enrolling: orderer-admin"

    ORG_NAME="orderer"
    source setclient.sh   $ORG_NAME   admin
    checkCopyYAML
    ../bin/fabric-ca-client enroll -u http://orderer-admin:password@localhost:7054

    setupMSP

    # 3. hosp1-admin
    echo "Enrolling: hosp1-admin"

    ORG_NAME="hosp1"
    source setclient.sh   $ORG_NAME   admin
    checkCopyYAML
    ../bin/fabric-ca-client enroll -u http://hosp1-admin:password@localhost:7054

    setupMSP

    # 4. hosp2-admin
    echo "Enrolling: hosp2-admin"

    ORG_NAME="hosp2"
    source setclient.sh   $ORG_NAME   admin
    checkCopyYAML
    ../bin/fabric-ca-client enroll -u http://hosp2-admin:password@localhost:7054

    setupMSP


    # 5. hosp3-admin
    echo "Enrolling: hosp3-admin"

    ORG_NAME="hosp3"
    source setclient.sh   $ORG_NAME   admin
    checkCopyYAML
    ../bin/fabric-ca-client enroll -u http://hosp3-admin:password@localhost:7054

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