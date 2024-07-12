const express = require('express')
const app = express();
const shortURL = require('../models/model')
const { nanoid } = require('nanoid')

const getAllURL = async(req, res) => {
    try {
        const shortID = await shortURL.find({})
        res.status(200).json({ shortID })
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "error"})
    }
}

//POST url and create a shortid
const createShortURL = async(req, res) => {
    try {
        if (!req.body.url) {
            return res.status(400).json({ error: 'URL is required'})
        }
        const shortID = nanoid(6);
        const URL = await shortURL.create({
            shortid: shortID,
            redirectURL: req.body.url
        })
        res.status(201).json({ URL });
    } catch (error) {
        res.status(500).json({ msg: "error"})
    }
}

// GET (redirect user to original user)
const getRedirectURL = async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const result = await shortURL.find({ shortid: shortId });

        if (result.length > 0) {
        const redirectLink =  result[0].redirectURL

        if(!redirectLink.startsWith('http://') && !redirectLink.startsWith('https://')) {
            res.redirect(`https://${redirectLink}`);
        } else {
            res.redirect(redirectLink);
        }
    }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Could not get URL, please try again later'})
    }
}

// //Delete Entry
const deleteEntry = async (req, res) => {
    try {
        const { shortId } = req.params
        await shortURL.findOneAndDelete({ _id: shortId })

        res.status(200).send(`Entry with id: ${shortId} deleted`)

    } catch (error) {
        res.status(500).json ({ msg: error })
    }
} 

module.exports = {
    getAllURL,
    getRedirectURL,
    createShortURL,
    deleteEntry
    };

      