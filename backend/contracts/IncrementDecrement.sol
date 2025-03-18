// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract IncrementDecrement{
    int256 public counter;

    function increment() public {
        counter++;
    }

    function decrement() public {
        counter--;
    }

    function reset() public {
        counter = 0;
    }
}