// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract Whitelist {

    mapping(address => bool) public whitelist;
    event Authorized(address _address);

    constructor() {
        whitelist[msg.sender] = true;
    }

    modifier check() {
        require(whitelist[msg.sender] == true, "Unauthorized");
        _;
    }

    function authorize(address _address) public check {
        whitelist[_address] = true;
        emit Authorized(_address);
    }
}
