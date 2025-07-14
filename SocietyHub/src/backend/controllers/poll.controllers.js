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
        owner : ownerName.name,
    })

    if(!newPoll){
        throw new ApiError(500 , "Failed to create poll")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , newPoll , "Poll created successfully"))
})
// const getPolls = asyncHandler(async (req, res) => {
//     const polls = await Poll.aggregate([
//         { $match: { societyId: req.user.societyId, isClosed: true } }, // Filter closed polls
//         { 
//             $project: { 
//                 voters: 0, 
//                 __v: 0, 
//                 _id: 0, 
//                 createdAt: 0,
//                 updatedAt: 0,
//                 isClosed: 0,
//                 societyId: 0, 
//                 "options._id": 0 // Removes _id from options array
//             } 
//         }
//     ]);

//     return res
//         .status(200)
//         .json(new ApiResponse(200, polls, "Polls found successfully"));
// });

const getPolls = asyncHandler(async (req, res) => {
    const polls = await Poll.find({societyId : req.user.societyId}).select(" -__v  -societyId -createdAt -updatedAt -isClosed -voters -_id -options.voting -options._id")
    return res
    .status(200)
    .json(new ApiResponse(200 , polls , "Polls found successfully"))
})

const getAllPolls = asyncHandler(async (req, res) => {
    const polls = await Poll.find({societyId : req.user.societyId,isClosed : false}).select(" -__v  -societyId")
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
    const userId = req.user._id;
    const house = req.user.houseNo; // Ensure req.user is populated (middleware needed)

    if (!pollId.trim() || !optionId.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
        throw new ApiError(404, "Poll not found");
    }

    // Find if the user already voted in any option
    const previousOption = poll.options.find((opt) =>
        opt.voting.some((voter) => voter.toString() === userId.toString())
    );

    if (previousOption) {
        // Remove user's previous vote
        previousOption.votes -= 1;
        previousOption.voting = previousOption.voting.filter(
            (voter) => voter.toString() !== userId.toString()
        );
        poll.totalVotes -= 1;
    }

    // Find the new option to vote for
    const newOption = poll.options.find((opt) => opt._id.toString() === optionId);
    if (!newOption) {
        throw new ApiError(404, "Option not found");
    }

    // Add vote to the new option
    newOption.votes += 1;
    newOption.voting.push(userId);
    poll.totalVotes += 1;

    // Ensure poll.voters only contains unique voters
    poll.voters = poll.options.flatMap((opt) => opt.voting);

    // Update percentages
    poll.options.forEach((opt) => {
        opt.percent = poll.totalVotes > 0 ? Math.floor((opt.votes / poll.totalVotes) * 100) : 0;
    });

    await poll.save();

    return res.status(200).json(new ApiResponse(200, poll, "Poll voted successfully"));
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

    const updatedPoll = await Poll.findById(pollId )
        updatedPoll.isClosed = true
    await updatedPoll.save()
    if(!updatedPoll){
        throw new ApiError(500 , "Failed to close poll")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , updatedPoll , "Poll closed successfully"))

})

export {createPoll , getAllPolls , deletePoll , votePoll ,getPolls , closePoll}
