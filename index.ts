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
    const baseUrl = "https://api.squidrouter.com/";
    const squid = new Squid();

    squid.setConfig({
        baseUrl: baseUrl, // for mainnet use "https://api.0xsquid.com"
        integratorId: "trustwallet-api",
    });

    // init the SDK
    await squid.init();
    console.log("Squid inited");
    const fromChainId = 43114;
    const toChainId = 1;
    const provider = ethers.getDefaultProvider(
        squid.chains.find((c) => c.chainId === fromChainId)!.rpc
    );
    const signer = new ethers.Wallet(privateKey, provider);
    const params = {
        fromChain: fromChainId,
        fromToken: squid.tokens.find(
            (t) =>
                t.symbol.toLocaleLowerCase() === "avax" && t.chainId === fromChainId
        )!.address,
        fromAmount: ethers.utils.parseUnits("0.1", "18").toString(),
        toChain: toChainId,
        toToken: squid.tokens.find(
            (t) => t.symbol.toLocaleLowerCase() === "usdc" && t.chainId === toChainId
        )!.address,
        fromAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
        toAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
        slippage: 3.0,
        enableForecall: false,
        quoteOnly: false,
        /* collectFees: {
            integratorAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
            fee: 90
        } */
    };

    console.log("route params", params);
    const { route } = await squid.getRoute(params);
    console.log(route.params);
    /* const overrides = {
      maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("200", "gwei"),
    }; */

    /*  const tx = (await squid.executeRoute({
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
