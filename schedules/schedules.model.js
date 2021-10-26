'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Schedules = new Schema({
    day: {
        type: Date
    },
    fromHr: {
        type: Number
    },
    toHr: {
        type: Number
    },
    archived: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

const Schedule = mongoose.model('Schedules', Schedules);

module.exports = {Schedule};