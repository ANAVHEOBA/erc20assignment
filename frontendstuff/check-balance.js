const https = require('https');

const address = '0x84FE617fD1aF0bBbc573414c8fCf2715789F8728';

// Check Lisk Sepolia ETH balance
function checkLiskSepolia() {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, 'latest'],
    id: 1
  });

  const options = {
    hostname: 'rpc.sepolia-api.lisk.com',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      const result = JSON.parse(body);
      const balance = parseInt(result.result, 16) / 1e18;
      console.log('\n=== LISK SEPOLIA TESTNET ===');
      console.log('Address:', address);
      console.log('ETH Balance:', balance, 'ETH');
      console.log('Enough for gas?', balance > 0.0001 ? '✅ YES' : '❌ NO - Need more ETH');
    });
  });

  req.on('error', (e) => console.error('Error:', e));
  req.write(data);
  req.end();
}

// Check regular Sepolia ETH balance
function checkRegularSepolia() {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, 'latest'],
    id: 1
  });

  const options = {
    hostname: 'rpc.sepolia.org',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      const result = JSON.parse(body);
      const balance = parseInt(result.result, 16) / 1e18;
      console.log('\n=== ETHEREUM SEPOLIA TESTNET ===');
      console.log('Address:', address);
      console.log('ETH Balance:', balance, 'ETH');
      console.log('Note: This is different from Lisk Sepolia');
    });
  });

  req.on('error', (e) => console.error('Error:', e));
  req.write(data);
  req.end();
}

console.log('Checking balances...\n');
checkLiskSepolia();
setTimeout(() => checkRegularSepolia(), 1000);
