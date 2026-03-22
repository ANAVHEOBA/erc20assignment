const https = require('https');

const address = '0x84FE617fD1aF0bBbc573414c8fCf2715789F8728';
const liskRpc = 'rpc.sepolia-api.lisk.com';

// Check ETH balance
function checkETH() {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1
    });

    const options = {
      hostname: liskRpc,
      port: 443,
      path: '/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const result = JSON.parse(body);
        const balance = parseInt(result.result, 16) / 1e18;
        console.log('ETH Balance:', balance, 'ETH');
        resolve(balance);
      });
    });
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Address:', address);
  console.log('\n=== LISK SEPOLIA ===');
  await checkETH();
  console.log('\n💡 You need ETH for gas fees!');
  console.log('Get it from: https://sepolia-faucet.lisk.com/');
}

main();
