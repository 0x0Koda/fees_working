import { Squid } from "@0xsquid/sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();


const privateKey = process.env.PK!;
if (!privateKey)
    throw new Error("No private key provided, pls include in .env file");

(async () => {
    // instantiate the SDK
    //const baseUrl =
    //  "https://squid-api-git-feat-cosmos-maintestnet-0xsquid.vercel.app";
    const baseUrl = "https://api.squidrouter.com";
    const squid = new Squid({
        baseUrl: baseUrl,
    });
    // init the SDK
    await squid.init();
    console.log("Squid inited");
    const chainId = 43114;
    const provider = ethers.getDefaultProvider(
        squid.chains.find((c) => c.chainId === chainId)!.rpc
    );
    const signer = new ethers.Wallet(privateKey, provider);
    const toChainId = 250;
    const params = {
        fromChain: chainId,
        fromToken: squid.tokens.find(
            (t) =>
                t.symbol.toLocaleLowerCase() === "axlusdc" && t.chainId === chainId
        )!.address,
        fromAmount: ethers.utils.parseUnits("0.5", "6").toString(),
        toChain: toChainId,
        toToken: squid.tokens.find(
            (t) =>
                t.symbol.toLocaleLowerCase() === "axlusdc" && t.chainId === toChainId
        )!.address,
        toAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
        slippage: 3.0,
        enableForecall: false,
        quoteOnly: false,
        collectFees: {
            integratorAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
            fee: 90
        }
    };

    console.log("route params", params);
    const { route } = await squid.getRoute(params);
    console.log(route);
    const overrides = {
        maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
        maxFeePerGas: ethers.utils.parseUnits("200", "gwei"),
    };

    /* const tx = (await squid.executeRoute({
        signer,
        route,
        //overrides: overrides
    })) as ethers.providers.TransactionResponse;
    const txReceipt = await tx.wait();
    const txHash = txReceipt.transactionHash; */
    //const txHash =
    //  "0xa3f446fe845f528fecc62ec6e860d02a9b9a515087d19b84632bcccc6e978bdd";

    /*
    await sleep(5); //wait for axelar to index
    let statusResult = false;
    while (!statusResult) {
        console.log(`getting tx status for: ${txHash}`);
        try {
            const status = (await squid.getStatus({
                transactionId: txHash,
            })) as any;
            console.log(status);
            if (!!status.routeStatus) {
                if (
                    !!status.routeStatus.find(
                        (s) => s.chainId === toChainId && s.status === "success"
                    )
                ) {
                    statusResult = true;
                    console.log("########### tx success ############");
                    break;
                }
            }
        } catch (error) {
            console.log("not found yet..");
            await sleep(3);
            //console.log(error);
        }
    } */
    //console.log(`https://testnet.axelarscan.io/gmp/${txReceipt.transactionHash}`);
})();

const sleep = async (time: number) => {
    new Promise((r) => setTimeout(r, time * 1000));
};
