import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import secret from "./guideSecret.json" assert { type: "json" };

const umi = createUmi(
  "https://yolo-autumn-isle.solana-devnet.quiknode.pro/39f20f2d8a86ea2c506a4914824e026c512c17d0"
); //Replace with your QuickNode RPC Endpoint

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
  name: "Bitcoin",
  symbol: "BTS",
  description: "This is the NEW token ever!",
  image: "https://tan-wrong-shark-428.mypinata.cloud/ipfs/QmYyZtRQLSVfTrh32mMyLBFcsgz2FKYZf1wz4AXanqpEAN",
  uri: "https://tan-wrong-shark-428.mypinata.cloud/ipfs/Qmb8z53hgjhWjuuMmGA1ie6DccYLDUf4jVmYm26WMhTpWe",
};

// Define the target wallet where the token will be minted.
const targetWallet = "Dh5aukxCtKcGftUxATLvuMToDKLaQr5sNHiRqXL8cE9B";

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata());

createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 8,
  amount: 10000000000_00000000,
  tokenOwner: targetWallet, // Update the tokenOwner to the target wallet's public key
  tokenStandard: TokenStandard.Fungible,
})
  .sendAndConfirm(umi)
  .then(() => {
    console.log("Successfully minted tokens to", targetWallet, "(", mint.publicKey, ")");
  })
  .catch((err) => {
    console.error("Error minting tokens:", err);
  });