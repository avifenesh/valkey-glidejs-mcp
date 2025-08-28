#!/bin/bash

# Script to stop Valkey servers

echo "🛑 Stopping Valkey servers..."

# Stop and remove containers
docker stop valkey-standalone valkey-node-1 valkey-node-2 valkey-node-3 valkey-node-4 valkey-node-5 valkey-node-6 2>/dev/null
docker rm valkey-standalone valkey-node-1 valkey-node-2 valkey-node-3 valkey-node-4 valkey-node-5 valkey-node-6 2>/dev/null

# Remove the network
docker network rm valkey-cluster-net 2>/dev/null

echo "✅ All Valkey servers stopped and removed"
