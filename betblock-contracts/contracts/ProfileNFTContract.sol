// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract ProfileNFTContract is ERC721Enumerable, ERC721URIStorage, Pausable, FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;
    uint256 private _tokenIdCounter;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    mapping(uint256 => address) public originalMinter; // hold tokenId -> address mapping

    bytes32 donID = 0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000;
    uint32 gasLimit = 300000;

    error UnexpectedRequestID(bytes32 requestId);
    // Response event
    event FunctionsResponse(bytes32 indexed requestId, bytes response, bytes err);

    event MintResponse(address addr, uint256 ti);

    event RequestMismatch(bytes32 req1, bytes32 req2);

    // event for metadata being updated by the owner! backdoor for the contract owner :)
    event MetadataUpdated(uint256 indexed tokenId, string name, string description, string image);

    constructor(
        address router
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) ERC721("Betblock Bio", "BBB") {}

    // fill in the tokenURI
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // associate a tokenId with address as the original minter
    function associateTokenWithAddress(uint256 tokenId, address _address) internal {
        originalMinter[tokenId] = _address;
    }

    // return the original address minter for associated token
    function getAddressForTokenId(uint256 tokenId) external view returns (address) {
        return originalMinter[tokenId];
    }

    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
      super._increaseBalance(account, amount);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
      return super._update(to, tokenId, auth);
    }

    function manualMint(string memory newTokenURI) public {
        _safeMint(msg.sender, _tokenIdCounter);
        associateTokenWithAddress(_tokenIdCounter, msg.sender);
        _setTokenURI(_tokenIdCounter++, newTokenURI);
    }

    function mintBioToken(string memory newTokenURI, uint256 tokenId) public {
        address minterAddr = originalMinter[tokenId];
        require(balanceOf(minterAddr) == 0, "Address already owns an NFT");
        _safeMint(minterAddr, tokenId);
        _setTokenURI(tokenId, newTokenURI);
        _tokenIdCounter++;
        emit MintResponse(minterAddr, _tokenIdCounter - 1);
    }
    
    // mint requests is received, source function to generate AI image
    function mintRequest(
        string memory source,
        bytes memory encryptedSecretsUrl,
        string[] memory args,
        uint64 subscriptionId
    ) public returns (bytes32 requestId) {
        // prevent multiple mint requests
        require(balanceOf(msg.sender) == 0, "Address already owns an NFT");
        // get the next token and build different args list
        string[] memory fullArgs = new string[](2);
        fullArgs[0] = args[0];
        fullArgs[1] = Strings.toString(_tokenIdCounter);

        associateTokenWithAddress(_tokenIdCounter, msg.sender);

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        req.addSecretsReference(encryptedSecretsUrl);
        req.setArgs(fullArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    function sendRequestCBOR(
        bytes memory request,
        uint64 subscriptionId
    ) external onlyOwner returns (bytes32 requestId) {
        s_lastRequestId = _sendRequest(
            request,
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    // fulfill the mint request here
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;

        emit FunctionsResponse(requestId, s_lastResponse, s_lastError);
    }
}
