// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";

/**
 * @title IVoting
 * @notice Interface for the Voting contract, managing a single voting proposal with Self Protocol identity verification.
 * @dev Defines functions, events, and state variables for casting votes, tracking results, and enforcing constraints with Self Protocol proofs.
 */
interface IVoting {
    // ====================================================
    // Events
    // ====================================================

    /**
     * @notice Emitted when a voter casts their vote.
     * @param nullifier The nullifier derived from the Self Protocol proof, identifying the voter.
     * @param options The array of option indices voted for.
     */
    event Voted(uint256 indexed nullifier, uint256[] options);

    // ====================================================
    // State Variables
    // ====================================================

    /**
     * @notice The address of the VotingFactory contract that deployed this contract.
     * @dev Links the Voting contract to its factory for tracking purposes.
     */
    function factory() external view returns (address);

    /**
     * @notice The timestamp when voting ends.
     * @dev Voting is only allowed before this deadline.
     */
    function deadline() external view returns (uint256);

    /**
     * @notice The number of voting options available.
     * @dev Defines the range of valid option indices (0 to optionCount-1).
     */
    function optionCount() external view returns (uint256);

    /**
     * @notice Whether voters can select multiple options.
     * @dev If false, voters are restricted to a single option.
     */
    function allowMultipleChoices() external view returns (bool);

    /**
     * @notice Array storing the vote count for each option.
     * @dev Index corresponds to option number; value is the number of votes.
     */
    function voteCounts(uint256 index) external view returns (uint256);

    /**
     * @notice Mapping of nullifiers to their voting status.
     * @dev Tracks whether a nullifier (from Self Protocol proof) has voted to prevent double voting.
     */
    function hasVoted(uint256 nullifier) external view returns (bool);

    // ====================================================
    // Functions
    // ====================================================

    /**
     * @notice Verifies a Self Protocol VcAndDiscloseProof for voter eligibility.
     * @dev Validates the proof's scope, attestation ID, and voting status, and calls the Identity Verification Hub to verify the proof. Returns the nullifier if the voter is eligible.
     * @param proof The Self Protocol VcAndDiscloseProof to verify.
     * @return The nullifier extracted from the proof.
     */
    function hasVotingPower(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    ) external returns (uint256);
    
    /**
     * @notice Allows a voter to cast their vote for one or more options with Self Protocol identity verification.
     * @dev Validates the Self Protocol proof, checks voting constraints (deadline, multiple choices, valid options), and updates vote counts. Reverts if the proof is invalid, voter has already voted, deadline has passed, or options are invalid.
     * @param proof The Self Protocol VcAndDiscloseProof for identity verification.
     * @param options An array of option indices to vote for.
     */
    function vote(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof,
        uint256[] calldata options
    ) external;

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
    );
}