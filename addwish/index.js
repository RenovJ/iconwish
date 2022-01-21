const IconService = require('icon-sdk-js');
const httpProvider = new IconService.HttpProvider('https://ctz.solidwallet.io/api/v3') // mainnet
const iconService = new IconService(httpProvider)
const { IconWallet } = IconService;
const { IconConverter } = IconService;

/* Load Wallet object by private key */
const wallet = IconWallet.loadPrivateKey('');

exports.handler = async (event) => {
    const txObj = new IconService.IconBuilder.CallTransactionBuilder()
    .from('hx7b848e19fcd0e861f19566a31e9334e4d03d83b6')
    .to('cxc1d5ca6d7daede82e59b616ea6908807d7bea3b8')
    .stepLimit(IconConverter.toBigNumber('2000000'))
    .nid(IconConverter.toBigNumber('1'))
    .nonce(IconConverter.toBigNumber('1'))
    .version(IconConverter.toBigNumber('3'))
    .timestamp((new Date()).getTime() * 1000)
    .method('addNewFreeWish')
    .params({
        'x': IconConverter.toHex(event.x),
        'y': IconConverter.toHex(event.y),
        'rotation': IconConverter.toHex(event.rotation),
        'msg': event.message
    })
    .build()
      
    /* Create SignedTransaction instance */
    const signedTransaction = new IconService.SignedTransaction(txObj, wallet)
    
    /* Send transaction. It returns transaction hash. */
    const txHash = await iconService.sendTransaction(signedTransaction).execute();
      
    const response = {
        statusCode: 200,
        //body: JSON.stringify(event),
        body: txHash
    };
    return response;
};

