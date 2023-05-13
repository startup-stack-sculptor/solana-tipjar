// Replace this wallet address with the public key of the receiving wallet


function connectWallet(){

    (async() => {
	try {
	    const resp = await window.solana.connect();
	    wallet = resp;
	} catch (err) {
	    // { code: 4001, message: 'User rejected the request.' }
	}
    })();


    window.solana.on("connect", () => document.getElementById("status").innerText="Connected")

}


function signInTransactionAndSendMoney(){

    (async() => {

	// const network = "https://try-rpc.mainnet.solana.blockdaemon.tech";
	const network = 'https://api.devnet.solana.com'
	const connection = new solanaWeb3.Connection(network, 'confirmed');
	// const connection = new solanaWeb3.Connection(ne);
	const transaction = new solanaWeb3.Transaction();
	const lamports_per_sol= solanaWeb3.LAMPORTS_PER_SOL;
	const lamports = document.getElementById("quantity").value * lamports_per_sol;

	try {
	    // Change this key to the receiver wallet public key
	    console.log("starting sendMoney");
	    // const destPubkey = new solanaWeb3.PublicKey('7S8qCKU9KdDRKqS8XxvjjV3KifmvSWC594rhrDBjWyq4');
	    const destPubkey = '7S8qCKU9KdDRKqS8XxvjjV3KifmvSWC594rhrDBjWyq4';
	    const toAccount = solanaWeb3.Keypair.generate()
	    // const destPubkey = toAccount.publicKey
	   // const walletAccountInfo = await connection.getAccountInfo(
		//solanaWeb3.publicKey
	    // );
	    // console.log("wallet data size", walletAccountInfo);

	    // const receiverAccountInfo = await connection.getAccountInfo(destPubkey);
	    // console.log("receiver data size", receiverAccountInfo);

	    const instruction = solanaWeb3.SystemProgram.transfer({
		fromPubkey: solana.publicKey,
		toPubkey: destPubkey,
		lamports: lamports, // about half a SOL
	    });
	    let trans = await setWalletTransaction(instruction, connection);

	    let signature = await signAndSendTransaction(wallet, trans, connection);
	    let result = await connection.confirmTransaction(signature, "singleGossip");
	    console.log("money sent", result);
	} catch (e) {
	    console.warn("Failed", e);
	}


    })()
    
    async function setWalletTransaction(
	instruction,connection
    ) {
	const transaction = new solanaWeb3.Transaction();
	transaction.add(instruction);
	transaction.feePayer = wallet.publicKey;
	let hash = await connection.getRecentBlockhash();
	console.log("blockhash", hash);
	transaction.recentBlockhash = hash.blockhash;
	return transaction;
    }

    async function signAndSendTransaction(
	wallet,
	transaction,
	connection
    ) {
	// Sign transaction, broadcast, and confirm
	const { signature } = await window.solana.signAndSendTransaction(transaction);
	await connection.confirmTransaction(signature);


	//let signedTrans = await wallet.signTransaction(transaction);
	console.log("sign transaction");
	//let signature = await connection.sendRawTransaction(signedTrans.serialize());
	console.log("send raw transaction");
	return signature;
    }

}

