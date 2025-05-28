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

/**
 * @title Voting
 * @notice A contract representing a single voting proposal with Self Protocol identity verification.
 * @dev Manages voting for a proposal, enforces constraints (deadline, multiple choices, valid options), and verifies voter identities using Self Protocol proofs. Uses hardcoded verification settings that may limit country and OFAC checks.
 */
contract Voting {
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
    /// @dev Includes settings for age verification, country restrictions, and OFAC compliance checks. Country and OFAC settings are hardcoded.
    ISelfVerificationRoot.VerificationConfig internal _verificationConfig;

    /// @notice Reference to the Self Protocol Identity Verification Hub contract.
    /// @dev Immutable address used for verifying proofs submitted during voting.
    IIdentityVerificationHubV1 internal immutable _identityVerificationHub;

    /// @notice The address of the VotingFactory contract that deployed this contract.
    /// @dev Links the Voting contract to its factory for tracking purposes.
    address public factory;

    /// @notice The timestamp when voting ends.
    /// @dev Voting is only allowed before this deadline.
    uint256 public deadline;

    /// @notice The number of voting options available.
    /// @dev Defines the range of valid option indices (0 to optionCount-1).
    uint256 public optionCount;

    /// @notice Whether voters can select multiple options.
    /// @dev If false, voters are restricted to a single option.
    bool public allowMultipleChoices;

    /// @notice Array storing the vote count for each option.
    /// @dev Index corresponds to option number; value is the number of votes.
    uint256[] public voteCounts;

    /// @notice Mapping of nullifiers to their voting status.
    /// @dev Tracks whether a nullifier (from Self Protocol proof) has voted to prevent double voting.
    mapping(uint256 => bool) public hasVoted;

    /// @notice Internal mapping of nullifiers to their voting status.
    /// @dev Mirrors hasVoted for internal verification to ensure consistency with Self Protocol checks.
    mapping(uint256 => bool) internal _nullifiers;

    // ====================================================
    // Events
    // ====================================================

    /// @notice Emitted when a voter casts their vote.
    /// @param nullifier The nullifier derived from the Self Protocol proof, identifying the voter.
    /// @param options The array of option indices voted for.
    event Voted(uint256 indexed nullifier, uint256[] options);

    // ====================================================
    // Errors
    // ====================================================

    /// @notice Thrown when the proof's scope does not match the expected scope.
    /// @dev Triggered during proof verification in vote if the scope is invalid.
    error InvalidScope();

    /// @notice Thrown when the proof's attestation ID does not match the expected ID.
    /// @dev Triggered during proof verification in vote if the attestation ID is invalid.
    error InvalidAttestationId();

    // ====================================================
    // Constructor
    // ====================================================

    /**
     * @notice Initializes a new voting contract for a single proposal with Self Protocol verification.
     * @dev Sets up voting parameters, initializes vote counts, and configures Self Protocol verification settings. Hardcodes country restrictions and OFAC checks to disabled, which may limit verification enforcement. Reverts if option count is zero or deadline is in the past.
     * @param identityVerificationHub The address of the Self Protocol Identity Verification Hub contract.
     * @param scope The expected scope value for proof validation.
     * @param attestationId The expected attestation ID for proof validation.
     * @param _factory The address of the VotingFactory contract.
     * @param _deadline The timestamp when voting ends.
     * @param _optionCount The number of voting options available.
     * @param _allowMultipleChoices Whether voters can select multiple options.
     * @param _hasAgeConstraint Whether age verification is enabled.
     * @param _minAge The minimum age required if age verification is enabled.
     */
    constructor(
        address identityVerificationHub, 
        uint256 scope, 
        uint256 attestationId,
        address _factory,
        uint256 _deadline,
        uint256 _optionCount,
        bool _allowMultipleChoices,
        bool _hasAgeConstraint,
        uint256 _minAge
    ) {
        require(_optionCount > 0, "Option count must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        _identityVerificationHub = IIdentityVerificationHubV1(identityVerificationHub);
        _scope = scope;
        _attestationId = attestationId;
        _verificationConfig.olderThanEnabled = _hasAgeConstraint;
        _verificationConfig.olderThan = _minAge;
        _verificationConfig.forbiddenCountriesEnabled = false;
        _verificationConfig.forbiddenCountriesListPacked = [0, 0, 0, 0];
        _verificationConfig.ofacEnabled = [false, false, false];

        factory = _factory;
        deadline = _deadline;
        optionCount = _optionCount;
        allowMultipleChoices = _allowMultipleChoices;

        voteCounts = new uint256[](_optionCount);
    }

    // ====================================================
    // External Functions
    // ====================================================

    /**
     * @notice Verifies a Self Protocol VcAndDiscloseProof for voter eligibility.
     * @dev Validates the proof's scope, attestation ID, and voting status, and calls the Identity Verification Hub to verify the proof. Returns the nullifier if the voter is eligible.
     * @param proof The Self Protocol VcAndDiscloseProof to verify.
     * @return The nullifier extracted from the proof.
     */
    function hasVotingPower(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    ) public returns (uint256) {
        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }

        uint256 nullifier = proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX];

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
     * @notice Allows a voter to cast their vote for one or more options with Self Protocol identity verification.
     * @dev Validates the Self Protocol proof, checks voting constraints (deadline, multiple choices, valid options), and updates vote counts. Reverts if the proof is invalid, voter has already voted, deadline has passed, or options are invalid. Uses hardcoded country and OFAC settings, which may limit verification.
     * @param proof The Self Protocol VcAndDiscloseProof for identity verification.
     * @param options An array of option indices to vote for.
     */
    function vote(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof, 
        uint256[] calldata options
    ) external {
        uint256 nullifier = hasVotingPower(proof);

        require(block.timestamp <= deadline, "Voting deadline has passed");

        if (_nullifiers[nullifier]) {
            revert("Already voted");
        }

        if (!allowMultipleChoices) {
            require(options.length == 1, "Multiple choices not allowed");
        } else {
            require(options.length > 0, "At least one option must be selected");
        }

        for (uint256 i = 0; i < options.length; i++) {
            require(options[i] < optionCount, "Invalid option index");
            voteCounts[options[i]]++;
        }
        hasVoted[nullifier] = true;
        _nullifiers[nullifier] = true;

        emit Voted(nullifier, options);
    }

    /**
     * @notice Retrieves the current state of the voting proposal.
     * @dev Returns the vote counts for each option, whether the proposal is active (before deadline), and the time remaining until the deadline.
     * @return votes An array of vote counts for each option.
     * @return isActive True if the proposal is active (before deadline), false otherwise.
     * @return timeLeft The time remaining until the deadline (0 if passed).
     */
    function getProposal() external view returns (
        uint256[] memory votes,
        bool isActive,
        uint256 timeLeft
    ) {
        uint256 time = block.timestamp > deadline ? 0 : deadline - block.timestamp;
        return (
            voteCounts,
            block.timestamp <= deadline,
            time
        );
    }
}