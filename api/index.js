// Express Initialisation
const express = require("express");
const app = express();
// const port = process.env.PORT || 8080;

// Sequelize Initialisation
const sequelize = require("./sequelize");
const { Op } = require("sequelize");

// Import created models
const JobPosting = require("./models/jobposting");
const Candidate = require("./models/candidate");

// Define entities relationship
JobPosting.hasMany(Candidate);

// Express middleware
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

// Kickstart the Express aplication
app.listen(() => {
    console.log("The server is running on http://localhost:8080");
});

// Create a middleware to handle 500 status errors.
app.use((error, request, response, next) => {
    console.error(`[ERROR]: ${error}`);
    response.status(500).json(error);
});

// Kickstart the Express aplication
app.listen(8080, async () => {
    console.log("server started");
    try {
        await sequelize.authenticate();
        console.log("connected to db");
    } catch {
        console.log("unable to connect to db");
    }
});

app.put("/", async (request, response, next) => {
    try {
        await sequelize.sync({ force: true });
        response.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

// ------------- PARENT REQUESTS ----------------
// GET all jobpostings *** cu filtrare, sortare, paginare ***
app.get("/jobpostings", async (request, response, next) => {
    const match = {};
    const { sortBy, text, date, page } = request.query;
    if (text && date) {
        match.description = { [Op.is]: text };
        match.deadline = { [Op.gt]: date };
    }

    if (text) {
        match.description = { [Op.is]: text };
    }

    if (date) {
        match.deadline = { [Op.gt]: date };
    }

    if (page) {
        try {
            const jobpostings = await JobPosting.findAndCountAll({
                limit: 3,
                order: sortBy ? [[sortBy, "ASC"]] : undefined,
                where: match,
                offset: 3 * page,
            });
            if (jobpostings.rows.length > 0) {
                response.json(jobpostings);
            } else {
                response.sendStatus(204);
            }
        } catch (error) {
            next(error);
        }
    } else {
        try {
            const jobpostings = await JobPosting.findAll({
                order: sortBy ? [[sortBy, "ASC"]] : undefined,
                where: match,
            });
            if (jobpostings.length > 0) {
                response.json(jobpostings);
            } else {
                response.sendStatus(204);
            }
        } catch (error) {
            next(error);
        }
    }
});

//GET a jobposting by id
app.get("/jobpostings/:jobPostingId", async (request, response, next) => {
    try {
        const jobPosting = await JobPosting.findByPk(
            request.params.jobPostingId
        );
        if (jobPosting) {
            response.json(jobPosting);
        } else {
            response.sendStatus(404);
        }
    } catch (error) {
        next(error);
    }
});

// POST a jobposting to the database
app.post("/jobpostings", async (request, response, next) => {
    try {
        const jobposting = await JobPosting.create(request.body);
        response.status(201).location(jobposting.id).send();
    } catch (error) {
        next(error);
    }
});

// PUT a jobposting
app.put("/jobpostings/:jobPostingId", async (req, res, next) => {
    try {
        const jobPosting = await JobPosting.findByPk(req.params.jobPostingId);
        if (jobPosting) {
            await jobPosting.update(req.body);
            res.status(200).json({ message: "JobPosting updated" });
        } else {
            res.status(404).json({ message: "JobPosting not found" });
        }
    } catch (error) {
        next(error);
    }
});

// DELETE a jobposting
app.delete("/jobpostings/:jobPostingId", async (req, res, next) => {
    try {
        const jobPosting = await JobPosting.findByPk(req.params.jobPostingId);
        if (jobPosting) {
            await jobPosting.destroy();
            res.status(200).json({ message: "jobPosting deleted" });
        } else {
            res.status(404).json({ message: "jobPosting not found" });
        }
    } catch (error) {
        next(error);
    }
});

// ------------------ CHILD REQUESTS -------------------
// GET a specific jobposting's candidates
app.get(
    "/jobPostings/:jobPostingId/candidates",
    async (request, response, next) => {
        try {
            const jobPosting = await JobPosting.findByPk(
                request.params.jobPostingId
            );
            if (jobPosting) {
                const candidates = await jobPosting.getCandidates();
                if (candidates.length > 0) {
                    response.json(candidates);
                } else {
                    response.sendStatus(204);
                }
            } else {
                response.sendStatus(404);
            }
        } catch (error) {
            next(error);
        }
    }
);

// GET a candidate by id from specific jobposting
app.get(
    "/jobPostings/:jobPostingId/candidates/:candidateId",
    async (req, res) => {
        try {
            const jobPosting = await JobPosting.findByPk(
                req.params.jobPostingId
            );
            if (jobPosting) {
                const candidates = await jobPosting.getCandidates({
                    where: {
                        id: req.params.candidateId,
                    },
                });
                const candidate = candidates.shift();
                if (candidate) {
                    res.status(200).json(candidate);
                } else {
                    res.status(404).json({ message: "Candidate not found" });
                }
            } else {
                res.status(404).json({ message: "Job Posting not found" });
            }
        } catch (err) {
            console.warn(err);
            res.status(500).json({ message: "Server error occured" });
        }
    }
);

// POST a candidate to a jobposting
app.post(
    "/jobpostings/:jobPostingId/candidates",
    async (request, response, next) => {
        try {
            const jobPosting = await JobPosting.findByPk(
                request.params.jobPostingId
            );
            if (jobPosting) {
                const candidate = await Candidate.create(request.body);
                jobPosting.addCandidate(candidate);
                await jobPosting.save();
                response.status(201).location(candidate.id).send();
            } else {
                response.sendStatus(404);
            }
        } catch (error) {
            next(error);
        }
    }
);

// PUT a candidate for a specific jobposting
app.put(
    "/jobpostings/:jobPostingId/candidates/:candidateId",
    async (req, res, next) => {
        try {
            const jobPosting = await JobPosting.findByPk(
                req.params.jobPostingId
            );
            if (jobPosting) {
                const candidates = await jobPosting.getCandidates({
                    where: {
                        id: req.params.candidateId,
                    },
                });
                const candidate = candidates.shift();
                if (candidate) {
                    await candidate.update(req.body);
                    res.status(200).json({
                        message: "Candidate from job posting updated",
                    });
                } else {
                    res.status(404).json({ message: "Candidate not found" });
                }
            } else {
                res.status(404).json({
                    message: "Job Posting group not found",
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

// DELETE a candidate from a specific jobposting
app.delete(
    "/jobpostings/:jobPostingId/candidates/:candidateId",
    async (req, res, next) => {
        try {
            const jobPosting = await JobPosting.findByPk(
                req.params.jobPostingId
            );
            if (jobPosting) {
                const candidates = await jobPosting.getCandidates({
                    where: {
                        id: req.params.candidateId,
                    },
                });
                const candidate = candidates.shift();
                if (candidate) {
                    await candidate.destroy();
                    res.status(200).json({
                        message: "Candidate deleted",
                    });
                } else {
                    res.status(404).json({ message: "Candidate not found" });
                }
            } else {
                res.status(404).json({ message: "JobPosting not found" });
            }
        } catch (error) {
            next(error);
        }
    }
);

// IMPORT
app.post("/", async (request, response, next) => {
    try {
        const registry = {};
        for (let j of request.body) {
            const jobposting = await JobPosting.create(j);
            for (let c of j.candidates) {
                const candidate = await Candidate.create(c);
                registry[c.key] = candidate;
                jobposting.addCandidate(candidate);
            }
            await jobposting.save();
        }
        response.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

// EXPORT
app.get("/", async (request, response, next) => {
    try {
        const result = [];
        for (let j of await JobPosting.findAll()) {
            const jobposting = {
                description: j.description,
                deadline: j.deadline,
            };
            for (let c of await j.getCandidates()) {
                jobposting.candidates.push({
                    key: c.id,
                    name: c.name,
                    cv: c.cv,
                    email: c.email,
                });
            }
            result.push(jobposting);
        }
        if (result.length > 0) {
            response.json(result);
        } else {
            response.sendStatus(204);
        }
    } catch (error) {
        next(error);
    }
});
