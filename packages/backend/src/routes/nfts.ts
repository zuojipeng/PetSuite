import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import { collections } from '../database/mongodb';

const router = Router();

// POST /api/nfts/mint - Mint pet NFT
router.post('/mint', async (req: Request, res: Response) => {
  try {
    const { owner, profileData } = req.body;

    if (!owner || !profileData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: owner, profileData',
      });
    }

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(
      process.env.MONAD_RPC_URL || 'https://testnet.rpc.monad.xyz'
    );

    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY || '',
      provider
    );

    const petNFTAddress = process.env.PET_NFT_ADDRESS;
    if (!petNFTAddress) {
      throw new Error('PET_NFT_ADDRESS not configured');
    }

    const petNFTABI = [
      'function createPetProfile(address owner, string memory initialMetadata) external returns (uint256)',
      'function getTotalSupply() public view returns (uint256)',
    ];

    const petNFT = new ethers.Contract(petNFTAddress, petNFTABI, wallet);

    // Mint NFT
    const metadataURI = `ipfs://${profileData}`; // In production, upload to IPFS first
    const tx = await petNFT.createPetProfile(owner, metadataURI);
    const receipt = await tx.wait();

    // Get token ID from event
    const tokenId = await petNFT.getTotalSupply();

    // Save to database
    await collections.pets().updateOne(
      { 'profile.name': profileData.name },
      {
        $set: {
          tokenId: Number(tokenId),
          owner,
          metadataURI,
          txHash: receipt.hash,
          updatedAt: new Date(),
        },
      }
    );

    res.json({
      success: true,
      tokenId: Number(tokenId),
      txHash: receipt.hash,
      metadataURI,
    });
  } catch (error: any) {
    console.error('Error in /mint:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/nfts/:tokenId - Get NFT details
router.get('/:tokenId', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(
      process.env.MONAD_RPC_URL || 'https://testnet.rpc.monad.xyz'
    );

    const petNFTAddress = process.env.PET_NFT_ADDRESS;
    if (!petNFTAddress) {
      throw new Error('PET_NFT_ADDRESS not configured');
    }

    const petNFTABI = [
      'function petEvolution(uint256) public view returns (uint8 stage, uint256 birthTime, uint256 healthScore, uint256 aiConsultCount, uint256 lastUpdate, string metadataURI)',
      'function ownerOf(uint256 tokenId) public view returns (address)',
      'function getPetDiscount(uint256 tokenId) public view returns (uint256)',
    ];

    const petNFT = new ethers.Contract(petNFTAddress, petNFTABI, provider);

    // Get on-chain data
    const evolution = await petNFT.petEvolution(tokenId);
    const owner = await petNFT.ownerOf(tokenId);
    const discount = await petNFT.getPetDiscount(tokenId);

    // Get off-chain data from database
    const dbData = await collections.pets().findOne({ tokenId: Number(tokenId) });

    res.json({
      success: true,
      tokenId: Number(tokenId),
      owner,
      petEvolution: {
        stage: ['Infant', 'Youth', 'Adult', 'Senior', 'Memorial'][Number(evolution[0])],
        birthTime: Number(evolution[1]),
        healthScore: Number(evolution[2]),
        aiConsultCount: Number(evolution[3]),
        lastUpdate: Number(evolution[4]),
      },
      metadataURI: evolution[5],
      discount: Number(discount),
      profile: dbData?.profile || null,
    });
  } catch (error: any) {
    console.error('Error in /nfts/:tokenId:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/nfts/user/:address - Get user's NFTs
router.get('/user/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    const nfts = await collections.pets()
      .find({ owner: address })
      .toArray();

    res.json({
      success: true,
      nfts: nfts.map(nft => ({
        tokenId: nft.tokenId,
        petName: nft.name,
        species: nft.species,
        healthScore: nft.healthScore,
        breed: nft.breed,
      })),
      total: nfts.length,
    });
  } catch (error: any) {
    console.error('Error in /user/:address:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
