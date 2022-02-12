import { React, useState, useEffect } from "react";
import axios from "axios";
import JobPosting from "./JobPosting";
import AddJobPosting from "./AddJobPosting";

function JobPostingList() {
    const [jobPostings, setJobPostings] = useState([]);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const FetchData = async () => {
            try {
                const response = await axios.get("/jobpostings");
                setJobPostings(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        FetchData();
    }, [jobPostings]);

    return (
        <div>
            <button
                className="add-btn"
                onClick={() => {
                    if (isClicked === true) setIsClicked(false);
                    else setIsClicked(true);
                }}
            >
                Add a new job posting
            </button>
            {isClicked && <AddJobPosting />}

            {jobPostings.length === 0 && (
                <h1>You currently haven't added any job posting</h1>
            )}
            {jobPostings.length > 0 &&
                jobPostings.map((jobPosting) => (
                    <div key={jobPosting.id}>
                        <JobPosting jobPosting={jobPosting} />
                    </div>
                ))}
        </div>
    );
}

export default JobPostingList;
