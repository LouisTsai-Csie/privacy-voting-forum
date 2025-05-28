import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdentifier } from '@selfxyz/core';
import { ethers } from 'ethers';
import { IVotingFactoryABI, IVotingABI } from '../../app/content/abi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('hihihi');
    if (req.method === 'POST') {
        try {
            const { proof, publicSignals } = req.body;

            if (!proof || !publicSignals) {
                return res.status(400).json({ message: 'Proof and publicSignals are required' });
            }

            console.log("Proof:", proof);
            console.log("Public signals:", publicSignals);

            // Contract details
            const contractAddress = process.env.VOTE_FACTORY_ADDRESS || "";
            const address = await getUserIdentifier(publicSignals, "hex");
            console.log("Extracted address from verification result:", address);

            // Connect to Celo network
            const provider = new ethers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
            if (!ethers.isAddress(contractAddress)) {
                throw new Error('Invalid contract address');
            }
            const contract = new ethers.Contract(contractAddress, IVotingFactoryABI, signer);

            const gasPrice = ethers.parseUnits('30', 'gwei');
            let gasLimit;
            try {
                const estimatedGas = await contract.UserVerification.estimateGas(proof);
                gasLimit = estimatedGas * BigInt(120) / BigInt(100);
            } catch (err) {
                console.warn("⚠️ gas estimate failed, use default value");
                gasLimit = BigInt(12000000);
            }

            try {
                console.log("sucess try to send!");
                const tx = await contract.UserVerification(
                    {
                        a: proof.a,
                        b: [
                            [proof.b[0][1], proof.b[0][0]],
                            [proof.b[1][1], proof.b[1][0]],
                        ],
                        c: proof.c,
                        pubSignals: publicSignals
                    },
                    {
                        gasPrice,
                        gasLimit
                    }
                );
                await tx.wait();
                console.log("Successfully called UserVerification function");
                res.status(200).json({
                    status: 'success',
                    result: true,
                    credentialSubject: {},
                });
            } catch (error) {
                console.error("Error calling UserVerification function:", error);
                res.status(400).json({
                    status: 'error',
                    result: false,
                    message: 'Verification failed or date of birth not disclosed',
                    details: {},
                });
                throw error;
            }
        } catch (error) {
            console.error('Error verifying proof:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error verifying proof',
                result: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}