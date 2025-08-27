import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerValidationTools } from '../src/tools/validate.js';

const SAMPLE_TS = `
export async function createClient(){}
export async function createCluster(){}
export function get(){}
export function set(){}
export function del(){}
export function expire(){}
export function hset(){}
export function hget(){}
export function publish(){}
export function subscribe(){}
export function eval(){}
export function lPush(){}
export function brPop(){}
export function sAdd(){}
export function sIsMember(){}
export function sMembers(){}
export function zAdd(){}
export function zRange(){}
export function zRem(){}
export function xAdd(){}
export function xGroupCreate(){}
export function xReadGroup(){}
export function xAck(){}
export function geoAdd(){}
export function geoSearch(){}
export function setBit(){}
export function getBit(){}
export function bitCount(){}
export function pfAdd(){}
export function pfCount(){}
export function pfMerge(){}
export function jsonSet(){}
export function jsonGet(){}
export function incr(){}
export function decr(){}
export function mGet(){}
export function mSet(){}
export function append(){}
export function strLen(){}
export function exists(){}
export function ttl(){}
export function persist(){}
export function rename(){}
export function scan(){}
export function hGetAll(){}
export function hMGet(){}
export function hMSet(){}
export function hIncrBy(){}
export function hDel(){}
export function hExists(){}
export function hLen(){}
export function hKeys(){}
export function hVals(){}
export function hScan(){}
export function lRange(){}
export function lLen(){}
export function lPop(){}
export function rPop(){}
export function rPush(){}
export function lTrim(){}
export function sRem(){}
export function sCard(){}
export function sPop(){}
export function sRandMember(){}
export function sDiff(){}
export function sInter(){}
export function sUnion(){}
export function zCard(){}
export function zScore(){}
export function zIncrBy(){}
export function zRank(){}
export function zRevRank(){}
export function zCount(){}
export function zRemRangeByScore(){}
export function zRemRangeByRank(){}
export function zPopMax(){}
export function zPopMin(){}
export function geoDist(){}
export function geoPos(){}
export function geoHash(){}
export function bitOp(){}
export function bitPos(){}
export function evalSha(){}
export function scriptLoad(){}
export function scriptExists(){}
export function scriptFlush(){}
export function pSubscribe(){}
export function pUnsubscribe(){}
`;

test('validate.glideSurface validates against provided TS sources and writes structured results', async () => {
  const mcp = new McpServer({ name: 'test', version: '0.0.0' });
  registerValidationTools(mcp);
  const tool = (mcp as any)._registeredTools?.['validate.glideSurface'];
  const res = await tool.callback({ sources: [{ id: 'sample', text: SAMPLE_TS }], writeReport: false } as any, {} as any);
  assert.ok(res.structuredContent.totalEntries > 0);
  assert.ok(res.structuredContent.validatedCount >= 1);
});

