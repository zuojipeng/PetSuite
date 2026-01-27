// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RecommendationVault is Ownable {
    uint256 private _recommendationCounter;

    struct AIRecommendation {
        address user;
        uint256 petTokenId;
        bytes32 queryHash;
        bytes32 resultHash;
        uint256 timestamp;
        bool verified;
    }

    mapping(uint256 => AIRecommendation) public recommendations;
    mapping(address => uint256[]) private userRecommendations;

    event RecommendationStored(
        uint256 indexed recommendationId,
        address indexed user,
        uint256 indexed petTokenId,
        bytes32 resultHash
    );
    event RecommendationVerified(uint256 indexed recommendationId);

    constructor() Ownable(msg.sender) {}

    function storeRecommendation(
        uint256 petTokenId,
        bytes32 queryHash,
        bytes32 resultHash
    ) external returns (uint256) {
        require(queryHash != bytes32(0), "Invalid query hash");
        require(resultHash != bytes32(0), "Invalid result hash");

        uint256 recommendationId = ++_recommendationCounter;

        recommendations[recommendationId] = AIRecommendation({
            user: msg.sender,
            petTokenId: petTokenId,
            queryHash: queryHash,
            resultHash: resultHash,
            timestamp: block.timestamp,
            verified: false
        });

        userRecommendations[msg.sender].push(recommendationId);

        emit RecommendationStored(
            recommendationId,
            msg.sender,
            petTokenId,
            resultHash
        );

        return recommendationId;
    }

    function getRecommendation(uint256 recommendationId)
        external
        view
        returns (
            address user,
            uint256 petTokenId,
            bytes32 queryHash,
            bytes32 resultHash,
            uint256 timestamp,
            bool verified
        )
    {
        require(recommendationId > 0 && recommendationId <= _recommendationCounter, "Invalid ID");

        AIRecommendation memory rec = recommendations[recommendationId];
        return (
            rec.user,
            rec.petTokenId,
            rec.queryHash,
            rec.resultHash,
            rec.timestamp,
            rec.verified
        );
    }

    function getUserRecommendations(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userRecommendations[user];
    }

    function verifyRecommendation(
        uint256 recommendationId,
        bytes32 expectedHash
    ) external view returns (bool) {
        require(recommendationId > 0 && recommendationId <= _recommendationCounter, "Invalid ID");

        AIRecommendation memory rec = recommendations[recommendationId];
        return rec.resultHash == expectedHash;
    }

    function markAsVerified(uint256 recommendationId) external onlyOwner {
        require(recommendationId > 0 && recommendationId <= _recommendationCounter, "Invalid ID");

        recommendations[recommendationId].verified = true;
        emit RecommendationVerified(recommendationId);
    }

    function getTotalRecommendations() external view returns (uint256) {
        return _recommendationCounter;
    }
}
