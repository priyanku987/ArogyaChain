#Launching peers of mohfw
echo "Launching peers of Mohfw..."
echo "Setting Gossip bootstrap for anchor peer..."
export CORE_PEER_GOSSIP_BOOTSTRAP=localhost:49153
echo "setting env variables with Mohfw admin..."
source set-env.sh mohfw admin 49152
echo "setting anchor peer identity..."
source set-identity.sh mohfw mohfw-anchor-peer
echo "launching anchor peer..."
source ./launch-peer.sh mohfw mohfw-anchor-peer 49152
echo "setting regular peer identity..."
source set-identity.sh mohfw mohfw-peer1
echo "launching regular peer..."
source ./launch-peer.sh mohfw mohfw-peer1 49999
echo "launched peers of Mohfw..."

#Launching peers of hosp1
echo "Launching peers of hosp1..."
echo "Setting Gossip bootstrap for anchor peer..."
export CORE_PEER_GOSSIP_BOOTSTRAP=localhost:51000
echo "setting env variables with hosp1 admin..."
source set-env.sh hosp1 admin 50999
echo "setting anchor peer identity..."
source set-identity.sh hosp1 hosp1-anchor-peer
echo "launching anchor peer..."
source ./launch-peer.sh hosp1 hosp1-anchor-peer 50999
echo "setting regular peer identity..."
source set-identity.sh hosp1 hosp1-peer1
echo "launching regular peer..."
source ./launch-peer.sh hosp1 hosp1-peer1 51999
echo "launched peers of hosp1..."


#Launching peers of hosp2
echo "Launching peers of hosp2..."
echo "Setting Gossip bootstrap for anchor peer..."
export CORE_PEER_GOSSIP_BOOTSTRAP=localhost:53000
echo "setting env variables with hosp1 admin..."
source set-env.sh hosp2 admin 52999
echo "setting anchor peer identity..."
source set-identity.sh hosp2 hosp2-anchor-peer
echo "launching anchor peer..."
source ./launch-peer.sh hosp2 hosp2-anchor-peer 52999
echo "setting regular peer identity..."
source set-identity.sh hosp2 hosp2-peer1
echo "launching regular peer..."
source ./launch-peer.sh hosp2 hosp2-peer1 53999
echo "launched peers of hosp2..."

