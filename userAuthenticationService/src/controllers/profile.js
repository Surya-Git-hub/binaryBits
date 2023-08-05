const profileService = require("../services/profile");
const {
    hasValue,
} = require("../helpers");

const create = async (req, res) => {
    try {
        const { name, profession, bio, country, githubProfile, organizations, profilePhoto } = req.body;
        // console.log(name)
        if (!hasValue(name) && !hasValue(profession) && !hasValue(bio) && !hasValue(country) && !hasValue(githubProfile) && !hasValue(organizations) && !hasValue(profilePhoto)) {
            return res
                .status(200)
                .json({ status: "Nothing saved because nothing to save" });
        }
        const professionRegex = /^[a-zA-Z\s]+$/;
        const bioRegex = /^.{0,150}$/;
        if (!professionRegex.test(profession) && profession !== "") {
            return res.status(400).json({ error: "profession is invalid" });
        }
        if (!bioRegex.test(bio) && bio !== "") {
            return res.status(400).json({ error: "bio is invalid" });
        }
        await profileService.create(req, res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

const get = async (req, res) => {
    try {
        const id = req.params?.userId;
        if (!hasValue(id)) {
            return res.status(400).json({ error: "userId is required in params" });
        }
        await profileService.get(req, res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });

    }
}

const update = async (req, res) => {
    try {

        const { updates } = req.body;
        if (!hasValue(updates)) {
            return res
                .status(200)
                .json({ status: "Nothing saved because nothing to save" });
        }
        // Perform data validation
        const validUpdates = {};

        // Validate and add each field to the validUpdates object
        if (typeof updates.bio === 'string') {
            validUpdates.bio = updates.bio;
        }

        if (typeof updates.profilePhoto === 'string') {
            validUpdates.profilePhoto = updates.profilePhoto;
        }

        if (typeof updates.profession === 'string') {
            validUpdates.profession = updates.profession;
        }

        if (updates.dob instanceof Date) {
            validUpdates.dob = updates.dob;
        }

        if (typeof updates.location === 'string') {
            validUpdates.location = updates.location;
        }

        if (typeof updates.github === 'string') {
            validUpdates.github = updates.github;
        }

        if (Array.isArray(updates.socials)) {
            validUpdates.socials = updates.socials;
        }

        if (Array.isArray(updates.organizations)) {
            validUpdates.organizations = updates.organizations;
        }
        await profileService.update(req, res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });

    }
}

const remove = async (req, res) => {
    try {
        await profileService.remove(req, res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });

    }
}



module.exports = {
    create,
    get,
    update,
    remove,
};
