const express = require('express');
const {Schedule} = require('./schedules.model');
const app = express.Router();

app.post('/', async (req, res) => {
    try {

        if(req.body.fromHr<9 || req.body.toHr>18) throw { code: 400, message: 'slots are available only for the time between 9 - 18 horus'}
        const date = new Date(req.body.day);
        console.info('date',date);
        const isAlreadyBooked = await Schedule.findOne({
            day: req.body.day,
            archived: false,
            $or: [
                {fromHr : {
                    $gte: req.body.fromHr
                }},
                {toHr: {
                    $lte: req.body.toHr
                }}
            ]
        }).lean().exec();

        if(isAlreadyBooked) {
            /**one of the slot is already booked */
            throw { code: 400, message: 'One of the slot is already blocked. please check the available slots again'}
        }
        const createScheduleQuery = {
            day: req.body.day,
            fromHr: req.body.fromHr,
            toHr: req.body.toHr
        };
        const schedule = new Schedule(createScheduleQuery);
        const scheduleCreateResponse = await schedule.save();
        return res.status(200).json({
            message: 'Success',
            result: scheduleCreateResponse
        });

    } catch (error) {
        console.error(`Catch error inside bookRoom(): ${error.message}`);
        if(error.code && error.message)
            return res.status(error.code).json({ message: 'Error', result: error.message});
        else 
            return res.status(500).json({ message: 'Serve error', result: error.message});
    }
});

app.put('/:id', async (req, res) => {
    try {
        const updateQuery = {
            day: req.body.day,
            fromHr: req.body.fromHr,
            toHr: req.body.toHr 
        };

        const updateResult = await Schedule.findOneAndUpdate({_id: req.params.id}, updateQuery, { new: true}).lean().exec();

        return res.json({
            message: 'Success',
            result: updateResult
        });
    } catch (error) {
        console.error(`Catch error inside put server of schedules(): ${error.message}`);
        if(error.code && error.message)
            return res.status(error.code).json({ message: 'Error', result: error.message});
        else 
            return res.status(500).json({ message: 'Serve error', result: error.message});
    }
})

app.delete('/id', async(req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).lean().exec();
        const meetingDate = new Date(schedule.day);
    } catch (error) {
        console.error(`Catch error inside delete server of schedules(): ${error.message}`);
        if(error.code && error.message)
            return res.status(error.code).json({ message: 'Error', result: error.message});
        else 
            return res.status(500).json({ message: 'Serve error', result: error.message});
    }
})

module.exports = app;