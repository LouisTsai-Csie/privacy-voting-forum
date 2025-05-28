// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import Self Protocol
import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";

import {Formatter} from "@selfxyz/contracts/contracts/libraries/Formatter.sol";
import {CircuitAttributeHandler} from "@selfxyz/contracts/contracts/libraries/CircuitAttributeHandler.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

import "./Voting.sol";

/**
 * @title VotingFactory
 * @notice A factory contract for creating and managing Voting contracts with Self Protocol identity verification.
 * @dev Deploys Voting contracts for proposals, enforces blacklisting via nullifiers, and integrates with Self Protocol for proof-based identity verification.
 */
contract VotingFactory {
    // ====================================================
    // Storage Variables
    // ====================================================

    /// @notice The scope value that proofs must match for identity verification.
    /// @dev Used to validate that submitted proofs align with the expected scope defined by the Self Protocol.
    uint256 internal _scope;

    /// @notice The attestation ID that proofs must match for identity verification.
    /// @dev Ensures submitted proofs contain the correct attestation ID as per Self Protocol requirements.
    uint256 internal _attestationId;

    /// @notice Configuration settings for the Self Protocol verification process.
    /// @dev Includes settings for age verification, country restrictions, and OFAC compliance checks.
    ISelfVerificationRoot.VerificationConfig internal _verificationConfig;

    /// @notice Reference to the Self Protocol Identity Verification Hub contract.
    /// @dev Immutable address used for verifying proofs submitted during voting contract creation.
    IIdentityVerificationHubV1 internal immutable _identityVerificationHub;

    /// @notice The address of the contract owner.
    /// @dev The owner has exclusive rights to manage admin privileges.
    address public owner;

    /// @notice Mapping of nullifiers to their blacklist status.
    /// @dev Nullifiers are derived from Self Protocol proofs to prevent blacklisted identities from creating voting contracts.
    mapping(uint256 => bool) public blacklist;

    /// @notice Mapping of addresses to their admin status.
    /// @dev Admins can update the blacklist; the owner is automatically an admin.
    mapping(address => bool) public admins;

    /// @notice Array of all Voting contract addresses created by this factory.
    /// @dev Stores the history of deployed Voting contracts for tracking purposes.
    address[] public votingContracts;

    // ====================================================
    // Events
    // ====================================================

    /// @notice Emitted when a new Voting contract is created.
    /// @param votingContract The address of the newly deployed Voting contract.
    /// @param nullifier The nullifier derived from the Self Protocol proof, identifying the creator's identity.
    event VotingContractCreated(address indexed votingContract, uint256 nullifier);

    /// @notice Emitted when a nullifier's blacklist status is updated.
    /// @param nullifier The nullifier whose blacklist status was updated.
    /// @param status True if the nullifier was blacklisted, false if removed.
    event BlacklistStatusUpdated(uint256 indexed nullifier, bool status);

    /// @notice Emitted when an address is added to the admin list.
    /// @param admin The address granted admin privileges.
    event AdminAdded(address indexed admin);

    /// @notice Emitted when an address is removed from the admin list.
    /// @param admin The address whose admin privileges were revoked.
    event AdminRemoved(address indexed admin);

    // ====================================================
    // Errors
    // ====================================================

    /// @notice Thrown when the proof's scope does not match the expected scope.
    /// @dev Triggered during proof verification in createVotingContract if the scope is invalid.
    error InvalidScope();

    /// @notice Thrown when the proof's attestation ID does not match the expected ID.
    /// @dev Triggered during proof verification in createVotingContract if the attestation ID is invalid.
    error InvalidAttestationId();

    // ====================================================
    // Modifiers
    // ====================================================

    /// @notice Restricts function access to the contract owner.
    /// @dev Reverts if the caller is not the owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    /// @notice Restricts function access to admins.
    /// @dev Reverts if the caller is not an admin.
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can perform this action");
        _;
    }

    // ====================================================
    // Constructor
    // ====================================================

    /**
     * @notice Initializes the VotingFactory contract with Self Protocol verification parameters.
     * @dev Sets the deployer as the owner and initial admin, configures Self Protocol parameters, and stores the identity verification hub address.
     * @param identityVerificationHub The address of the Self Protocol Identity Verification Hub contract.
     * @param scope The expected scope value for proof validation.
     * @param attestationId The expected attestation ID for proof validation.
     * @param olderThanEnabled Whether age verification is enabled.
     * @param olderThan The minimum age required if age verification is enabled.
     * @param forbiddenCountriesEnabled Whether country restrictions are enabled.
     * @param forbiddenCountriesListPacked Packed list of forbidden country codes.
     * @param ofacEnabled Array of OFAC compliance check settings.
     */
    constructor(
        address identityVerificationHub, 
        uint256 scope, 
        uint256 attestationId,
        bool olderThanEnabled,
        uint256 olderThan,
        bool forbiddenCountriesEnabled,
        uint256[4] memory forbiddenCountriesListPacked,
        bool[3] memory ofacEnabled
    ) {
        _identityVerificationHub = IIdentityVerificationHubV1(identityVerificationHub);
        _scope = scope;
        _attestationId = attestationId;
        _verificationConfig.olderThanEnabled = olderThanEnabled;
        _verificationConfig.olderThan = olderThan;
        _verificationConfig.forbiddenCountriesEnabled = forbiddenCountriesEnabled;
        _verificationConfig.forbiddenCountriesListPacked = forbiddenCountriesListPacked;
        _verificationConfig.ofacEnabled = ofacEnabled;
        
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    // ====================================================
    // External Functions
    // ====================================================

    /**
     * @notice Verifies a Self Protocol VcAndDiscloseProof for user identity.
     * @dev Validates the proof's scope, attestation ID, and blacklist status, and calls the Identity Verification Hub to verify the proof. Returns the nullifier if valid.
     * @param proof The Self Protocol VcAndDiscloseProof to verify.
     * @return The nullifier extracted from the proof.
     */
    function UserVerification (
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    ) public returns (uint256) {
        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }

        uint256 nullifier = proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX];

        if (blacklist[nullifier]) {
            revert("Nullifier is blacklisted");
        }

        _identityVerificationHub.verifyVcAndDisclose(
            IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                olderThanEnabled: _verificationConfig.olderThanEnabled,
                olderThan: _verificationConfig.olderThan,
                forbiddenCountriesEnabled: _verificationConfig.forbiddenCountriesEnabled,
                forbiddenCountriesListPacked: _verificationConfig.forbiddenCountriesListPacked,
                ofacEnabled: _verificationConfig.ofacEnabled,
                vcAndDiscloseProof: proof
            })
        );

        return nullifier;
    }

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
    ) external returns (address) {
        uint256 nullifier = UserVerification(proof);

        Voting newVoting = new Voting(
            address(_identityVerificationHub),
            _scope,
            _attestationId,
            address(this),
            deadline,
            optionCount,
            allowMultipleChoices,
            hasAgeConstraint,
            minAge
        );
        votingContracts.push(address(newVoting));
        emit VotingContractCreated(address(newVoting), nullifier);
        return address(newVoting);
    }

    /**
     * @notice Updates the blacklist status of a nullifier.
     * @dev Sets the blacklist status for a nullifier, controlling whether the associated identity can create voting contracts. Only callable by admins.
     * @param nullifier The nullifier to update.
     * @param status True to blacklist the nullifier, false to remove it from the blacklist.
     */
    function setBlacklist(uint256 nullifier, bool status) external onlyAdmin {
        blacklist[nullifier] = status;
        emit BlacklistStatusUpdated(nullifier, status);
    }

    /**
     * @notice Adds an address to the admin list.
     * @dev Grants admin privileges to the specified address, allowing them to manage the blacklist. Only callable by the owner.
     * @param admin The address to add as an admin.
     */
    function addAdmin(address admin) external onlyOwner {
        require(!admins[admin], "Address is already an admin");
        admins[admin] = true;
        emit AdminAdded(admin);
    }

    /**
     * @notice Removes an address from the admin list.
     * @dev Revokes admin privileges from the specified address. The owner cannot be removed. Only callable by the owner.
     * @param admin The address to remove as an admin.
     */
    function removeAdmin(address admin) external onlyOwner {
        require(admins[admin], "Address is not an admin");
        require(admin != owner, "Cannot remove owner as admin");
        admins[admin] = false;
        emit AdminRemoved(admin);
    }

    /**
     * @notice Retrieves the list of all Voting contracts created by this factory.
     * @dev Returns an array of addresses for all deployed Voting contracts.
     * @return An array of Voting contract addresses.
     */
    function getVotingContracts() external view returns (address[] memory) {
        return votingContracts;
    }
}