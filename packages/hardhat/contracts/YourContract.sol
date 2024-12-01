// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract YourContract {
    // Mapping to store number of liked posts for each address
    mapping(address => uint256) public likedPostsCount;

    // Events to log actions
    event LikeAdded(address indexed user, uint256 newCount);
    event LikeRemoved(address indexed user, uint256 newCount);
    event LikesReset(address indexed user);

    // Increment the number of liked posts for the caller
    function incrementLikes() public {
        likedPostsCount[msg.sender] += 1;
        emit LikeAdded(msg.sender, likedPostsCount[msg.sender]);
    }

    // Decrement the number of liked posts for the caller
    function decrementLikes() public {
        require(likedPostsCount[msg.sender] > 0, "No likes to remove");
        likedPostsCount[msg.sender] -= 1;
        emit LikeRemoved(msg.sender, likedPostsCount[msg.sender]);
    }

    // Reset likes count to zero for the caller
    function resetLikes() public {
        likedPostsCount[msg.sender] = 0;
        emit LikesReset(msg.sender);
    }

    // View function to get likes count for any address
    function getLikesCount(address user) public view returns (uint256) {
        return likedPostsCount[user];
    }
}
