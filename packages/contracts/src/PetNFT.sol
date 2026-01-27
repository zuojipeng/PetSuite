// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PetNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;

    enum LifeStage { Infant, Youth, Adult, Senior, Memorial }

    struct PetEvolution {
        LifeStage stage;
        uint256 birthTime;
        uint256 healthScore;
        uint256 aiConsultCount;
        uint256 lastUpdate;
        string metadataURI;
    }

    mapping(uint256 => PetEvolution) public petEvolution;

    event PetCreated(uint256 indexed tokenId, address indexed owner);
    event PetEvolved(uint256 indexed tokenId, LifeStage newStage);
    event HealthUpdated(uint256 indexed tokenId, uint256 newScore);
    event AIConsultIncremented(uint256 indexed tokenId, uint256 count);

    constructor() ERC721("PetSuite NFT", "PET") Ownable(msg.sender) {}

    function createPetProfile(
        address owner,
        string memory initialMetadata
    ) external returns (uint256) {
        require(owner != address(0), "Invalid owner address");

        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(owner, tokenId);

        petEvolution[tokenId] = PetEvolution({
            stage: LifeStage.Infant,
            birthTime: block.timestamp,
            healthScore: 100,
            aiConsultCount: 0,
            lastUpdate: block.timestamp,
            metadataURI: initialMetadata
        });

        emit PetCreated(tokenId, owner);

        return tokenId;
    }

    function updateHealthScore(
        uint256 tokenId,
        uint256 newScore
    ) external {
        require(_ownerOf(tokenId) != address(0), "Pet does not exist");
        require(newScore <= 100, "Invalid score");

        PetEvolution storage pet = petEvolution[tokenId];
        pet.healthScore = newScore;
        pet.lastUpdate = block.timestamp;

        _checkAndEvolve(tokenId);

        emit HealthUpdated(tokenId, newScore);
    }

    function incrementAIConsult(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Pet does not exist");

        PetEvolution storage pet = petEvolution[tokenId];
        pet.aiConsultCount++;
        pet.lastUpdate = block.timestamp;

        emit AIConsultIncremented(tokenId, pet.aiConsultCount);
    }

    function getPetDiscount(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Pet does not exist");

        PetEvolution memory pet = petEvolution[tokenId];
        uint256 baseDiscount = 10; // 10% base discount

        // Add discount based on life stage
        if (pet.stage == LifeStage.Senior) {
            baseDiscount += 5; // Additional 5% for senior pets
        }

        // Add discount based on health score
        if (pet.healthScore > 90) {
            baseDiscount += 3;
        } else if (pet.healthScore > 70) {
            baseDiscount += 2;
        }

        // Add discount based on AI usage (loyalty)
        if (pet.aiConsultCount > 50) {
            baseDiscount += 5;
        } else if (pet.aiConsultCount > 20) {
            baseDiscount += 3;
        }

        return baseDiscount;
    }

    function _checkAndEvolve(uint256 tokenId) internal {
        PetEvolution storage pet = petEvolution[tokenId];
        uint256 age = (block.timestamp - pet.birthTime) / 30 days;

        LifeStage newStage;
        if (age < 6) {
            newStage = LifeStage.Infant;
        } else if (age < 18) {
            newStage = LifeStage.Youth;
        } else if (age < 84) {
            newStage = LifeStage.Adult;
        } else {
            newStage = LifeStage.Senior;
        }

        if (newStage != pet.stage) {
            pet.stage = newStage;
            emit PetEvolved(tokenId, newStage);
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_ownerOf(tokenId) != address(0), "Pet does not exist");
        return petEvolution[tokenId].metadataURI;
    }

    function updateMetadataURI(uint256 tokenId, string memory newURI) external {
        require(_ownerOf(tokenId) == msg.sender, "Not pet owner");
        petEvolution[tokenId].metadataURI = newURI;
        petEvolution[tokenId].lastUpdate = block.timestamp;
    }

    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
