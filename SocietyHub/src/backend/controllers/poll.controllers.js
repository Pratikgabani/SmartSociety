import {Poll} from "./../models/poll.models.js"
import {asyncHandler} from "./../utils/asyncHandler.js"
import {ApiError} from "./../utils/ApiError.js"
import {ApiResponse} from "./../utils/ApiResponse.js"
import {User} from "./../models/user.models.js"


const createPoll = asyncHandler(async (req, res) => {
    const {question , options } = req.body;
// End in feature is not correct there is misconception
    if(!question || !options){
        throw new ApiError(400 , "All fields are required")
    }
    if(options.length < 2){
    throw new ApiError(400 , "At least two options are required")
    }

    const ownerId = req.user._id
    const ownerName = await User.findById(ownerId)

    const newPoll = await Poll.create({
        question,
        options,
        date : new Date(),
        societyId : req.user.societyId,
        owner : ownerName.nameOfPersons[0],
    })

    if(!newPoll){
        throw new ApiError(500 , "Failed to create poll")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , newPoll , "Poll created successfully"))
})

const getAllPolls = asyncHandler(async (req, res) => {
    const polls = await Poll.find({societyId : req.user.societyId}).select("-voters -__v -_id -societyId")
    return res
    .status(200)
    .json(new ApiResponse(200 , polls , "Polls found successfully"))
})

const deletePoll = asyncHandler(async (req, res) => {
    const {pollId} = req.params

    if(!pollId.trim()){
        throw new ApiError(400 , "All fields are required")
    }

    const deletedPoll = await Poll.findByIdAndDelete(pollId);

    if(!deletedPoll){
        throw new ApiError(500 , "Failed to delete poll")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , deletedPoll , "Poll deleted successfully"))
})



const votePoll = asyncHandler(async (req, res) => {
    const { pollId, optionId } = req.params;
    const userId = req.user._id; // Ensure req.user is populated (middleware needed)
    console.log("hello")
    if (!pollId.trim() || !optionId.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const poll = await Poll.findById(pollId);
    console.log(poll)
    if (!poll) {
        throw new ApiError(404, "Poll not found");
    }

    // Check if the user has already voted
    // if (poll.voters.includes(userId)) {
    //     throw new ApiError(403, "You have already voted in this poll");
    // }

    // Find the selected option
    const option = poll.options.find((opt) => opt._id.toString() === optionId);
    if (!option) {
        throw new ApiError(404, "Option not found");
    }
     
    const votedOption =  poll.options.find((opt) => opt.voting.includes(userId))
    console.log(votedOption)
    if(votedOption){
     votedOption.votes -= 1
     votedOption.voting = votedOption.voting.filter(voter => voter.$oid === userId)
     poll.totalVotes -= 1
    }
    // Update vote count
    option.votes += 1;
    poll.totalVotes += 1;
    option.voting.push(userId)
    poll.options.map((opt) => {
        opt.percent = Math.floor((opt.votes/poll.totalVotes) * 100)
    })
   poll.voters.push(userId);
    await poll.save();

    return res
        .status(200)
        .json(new ApiResponse(200, poll, "Poll voted successfully"));
});


const closePoll = asyncHandler(async (req, res) => {
    const {pollId} = req.params

    if(!pollId.trim()){
        throw new ApiError(400 , "All fields are required")
    }

    const poll = await Poll.findById(pollId);
    if(!poll){
        throw new ApiError(404 , "Poll not found")
    }

    const updatedPoll = await Poll.findByIdAndUpdate(pollId  , {isClosed : !poll.isClosed} , {new : true})

    if(!updatedPoll){
        throw new ApiError(500 , "Failed to close poll")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , updatedPoll , "Poll closed successfully"))

})

export {createPoll , getAllPolls , deletePoll , votePoll , closePoll}
