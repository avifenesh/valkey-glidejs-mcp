#!/bin/bash

# Script to check status of Valkey servers

echo "📊 Checking Valkey servers status..."
echo ""

# Check standalone server
echo "🔍 Standalone Server (port 6379):"
if docker ps | grep -q valkey-standalone; then
  echo "   ✅ Running"
  docker exec valkey-standalone valkey-cli ping 2>/dev/null && echo "   ✅ Responsive" || echo "   ❌ Not responding"
else
  echo "   ❌ Not running"
fi

echo ""
echo "🔍 Cluster Nodes:"

# Check cluster nodes
for i in {1..6}; do
  PORT=$((6999 + $i))
  if docker ps | grep -q valkey-node-$i; then
    echo "   Node $i (port $PORT): ✅ Running"
  else
    echo "   Node $i (port $PORT): ❌ Not running"
  fi
done

# Check cluster status if node 1 is running
if docker ps | grep -q valkey-node-1; then
  echo ""
  echo "🔍 Cluster Status:"
  docker exec valkey-node-1 valkey-cli cluster info | grep cluster_state 2>/dev/null || echo "   Unable to get cluster info"
fi

echo ""
echo "To set up servers, run: ./setup-valkey-servers.sh"
echo "To stop servers, run: ./stop-valkey-servers.sh"
