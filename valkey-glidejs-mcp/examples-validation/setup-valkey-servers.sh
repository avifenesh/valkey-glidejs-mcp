#!/bin/bash

# Script to set up both standalone and cluster Valkey servers for testing

echo "🚀 Setting up Valkey servers for testing..."

# Stop and remove any existing containers
echo "🧹 Cleaning up existing containers..."
docker stop valkey-standalone valkey-node-1 valkey-node-2 valkey-node-3 valkey-node-4 valkey-node-5 valkey-node-6 2>/dev/null
docker rm valkey-standalone valkey-node-1 valkey-node-2 valkey-node-3 valkey-node-4 valkey-node-5 valkey-node-6 2>/dev/null

# Remove old network if exists
docker network rm valkey-cluster-net 2>/dev/null

# Create a Docker network for the cluster
echo "🌐 Creating Docker network..."
docker network create valkey-cluster-net

# Start standalone Valkey server
echo "📦 Starting standalone Valkey server on port 6379..."
docker run -d \
  --name valkey-standalone \
  -p 6379:6379 \
  valkey/valkey:latest

# Start Valkey cluster nodes with proper port mapping (using 7100-7105 to avoid conflicts)
echo "📦 Starting Valkey cluster nodes..."

# Start 6 nodes for the cluster (3 masters, 3 replicas)
for i in {1..6}; do
  PORT=$((7099 + $i))  # This will give us 7100-7105
  docker run -d \
    --name valkey-node-$i \
    --network valkey-cluster-net \
    --network-alias valkey-node-$i \
    -p $PORT:6379 \
    -p 1$PORT:16379 \
    valkey/valkey:latest \
    valkey-server \
    --port 6379 \
    --cluster-enabled yes \
    --cluster-config-file nodes.conf \
    --cluster-node-timeout 5000 \
    --cluster-announce-ip 127.0.0.1 \
    --cluster-announce-port $PORT \
    --cluster-announce-bus-port 1$PORT \
    --appendonly yes
done

# Wait for nodes to be fully ready
echo "⏳ Waiting for nodes to start (15 seconds)..."
sleep 15

# Test connectivity to each node
echo "🔍 Testing node connectivity..."
for i in {1..6}; do
  PORT=$((7099 + $i))
  echo -n "  Node $i (port $PORT): "
  docker exec valkey-node-$i valkey-cli ping && echo "✓" || echo "✗"
done

# Create the cluster using localhost ports
echo ""
echo "🔗 Creating Valkey cluster..."
CLUSTER_NODES=""
for i in {1..6}; do
  PORT=$((7099 + $i))
  CLUSTER_NODES="$CLUSTER_NODES 127.0.0.1:$PORT"
done

# Create cluster with 1 replica per master (3 masters, 3 replicas)
# Use node-1 to create the cluster
docker exec valkey-node-1 valkey-cli --cluster create $CLUSTER_NODES --cluster-replicas 1 --cluster-yes

# Wait a bit for cluster to stabilize
sleep 3

# Check cluster status
echo ""
echo "📊 Checking cluster status..."
docker exec valkey-node-1 valkey-cli --cluster check 127.0.0.1:7100 2>/dev/null || echo "Note: Cluster check not available"

# Test basic operations
echo ""
echo "🧪 Testing basic operations..."
echo -n "  Standalone (6379): "
docker exec valkey-standalone valkey-cli ping && echo "✓ Working" || echo "✗ Failed"

echo -n "  Cluster (7100): "
docker exec valkey-node-1 valkey-cli -c -p 6379 ping && echo "✓ Working" || echo "✗ Failed"

echo ""
echo "✅ Valkey servers setup complete!"
echo ""
echo "📊 Server Status:"
echo "  Standalone: localhost:6379"
echo "  Cluster nodes:"
echo "    - Node 1: localhost:7100"
echo "    - Node 2: localhost:7101"  
echo "    - Node 3: localhost:7102"
echo "    - Node 4: localhost:7103"
echo "    - Node 5: localhost:7104"
echo "    - Node 6: localhost:7105"
echo ""
echo "  Cluster is configured with 3 masters and 3 replicas"
echo ""
echo "To stop servers, run: ./stop-valkey-servers.sh"
echo "To check status, run: ./status-valkey-servers.sh"
