// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";

/**
 * @title IVotingFactory
 * @notice Interface for the VotingFactory contract, managing the creation and administration of Voting contracts with Self Protocol identity verification.
 * @dev Defines functions, events, and state variables for deploying Voting contracts, managing blacklists via nullifiers, and administering permissions.
 */
interface IVotingFactory {
    // ====================================================
    // Events
    // ====================================================

    /**
     * @notice Emitted when a new Voting contract is created.
     * @param votingContract The address of the newly deployed Voting contract.
     * @param nullifier The nullifier derived from the Self Protocol proof, identifying the creator's identity.
     */
    event VotingContractCreated(address indexed votingContract, uint256 nullifier);

    /**
     * @notice Emitted when a nullifier's blacklist status is updated.
     * @param nullifier The nullifier whose blacklist status was updated.
     * @param status True if the nullifier was blacklisted, false if removed.
     */
    event BlacklistStatusUpdated(uint256 indexed nullifier, bool status);

    /**
     * @notice Emitted when an address is added to the admin list.
     * @param admin The address granted admin privileges.
     */
    event AdminAdded(address indexed admin);

    /**
     * @notice Emitted when an address is removed from the admin list.
     * @param admin The address whose admin privileges were revoked.
     */
    event AdminRemoved(address indexed admin);

    // ====================================================
    // State Variables
    // ====================================================

    /**
     * @notice The address of the contract owner.
     * @dev The owner has exclusive rights to manage admin privileges.
     */
    function owner() external view returns (address);

    /**
     * @notice Mapping of nullifiers to their blacklist status.
     * @dev Nullifiers are derived from Self Protocol proofs to prevent blacklisted identities from creating voting contracts.
     */
    function blacklist(uint256 nullifier) external view returns (bool);

    /**
     * @notice Mapping of addresses to their admin status.
     * @dev Admins can update the blacklist; the owner is automatically an admin.
     */
    function admins(address admin) external view returns (bool);

    /**
     * @notice Array of all Voting contract addresses created by this factory.
     * @dev Stores the history of deployed Voting contracts for tracking purposes.
     */
    function votingContracts(uint256 index) external view returns (address);

    // ====================================================
    // Functions
    // ====================================================

    /**
     * @notice Verifies a Self Protocol VcAndDiscloseProof for user identity.
     * @dev Validates the proof's scope, attestation ID, and blacklist status, and calls the Identity Verification Hub to verify the proof. Returns the nullifier if valid.
     * @param proof The Self Protocol VcAndDiscloseProof to verify.
     * @return The nullifier extracted from the proof.
     */
    function UserVerification(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    ) external returns (uint256);

    /**
     * @notice Creates a new Voting contract for a proposal with Self Protocol identity verification.
     * @dev Deploys a Voting contract, validates the provided proof against scope, attestation ID, and blacklist status, and records the contract address. Reverts if the proof is invalid or the nullifier is blacklisted.
     * @param deadline The timestamp when voting ends.
     * @param optionCount The number of voting options available.
     * @param allowMultipleChoices Whether voters can select multiple options.
     * @param hasAgeConstraint Whether an age restriction applies to voters.
     * @param minAge The minimum age required to vote if age constraint is enabled.
     * @param proof The Self Protocol VcAndDiscloseProof for identity verification.
     * @return The address of the newly created Voting contract.
     */
    function createVotingContract(
        uint256 deadline,
        uint256 optionCount,
        bool allowMultipleChoices,
        bool hasAgeConstraint,
        uint256 minAge,
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    ) external returns (address);

    /**
     * @notice Updates the blacklist status of a nullifier.
     * @dev Sets the blacklist status for a nullifier, controlling whether the associated identity can create voting contracts. Only callable by admins.
     * @param nullifier The nullifier to update.
     * @param status True to blacklist the nullifier, false to remove it from the blacklist.
     */
    function setBlacklist(uint256 nullifier, bool status) external;

    /**
     * @notice Adds an address to the admin list.
     * @dev Grants admin privileges to the specified address, allowing them to manage the blacklist. Only callable by the owner.
     * @param admin The address to add as an admin.
     */
    function addAdmin(address admin) external;

    /**
     * @notice Removes an address from the admin list.
     * @dev Revokes admin privileges from the specified address. The owner cannot be removed. Only callable by the owner.
     * @param admin The address to remove as an admin.
     */
    function removeAdmin(address admin) external;

    /**
     * @notice Retrieves the list of all Voting contracts created by this factory.
     * @dev Returns an array of addresses for all deployed Voting contracts.
     * @return An array of Voting contract addresses.
     */
    function getVotingContracts() external view returns (address[] memory);
}