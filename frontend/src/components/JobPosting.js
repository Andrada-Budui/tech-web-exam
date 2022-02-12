import { React, useState, useEffect } from "react";
import axios from "axios";
import EditJobPosting from "./EditJobPosting";
import CandidateList from "./CandidateList";

function JobPosting({ jobPosting }) {
    const [isClicked, setIsClicked] = useState(false);
    const [btnIsClicked, setBtnIsClicked] = useState(false);

    const deleteJobPosting = () => {
        console.log(jobPosting);
        axios.delete("/jobpostings/" + jobPosting.id);
    };

    return (
        <div id="card">
            <div className="job-card">
                <div
                    className="job-info"
                    onClick={() => {
                        if (isClicked === true) setIsClicked(false);
                        else setIsClicked(true);
                    }}
                >
                    <h4>{jobPosting.description}</h4>
                    <h5>{jobPosting.deadline}</h5>
                </div>
                <button className="delete-btn" onClick={deleteJobPosting}>
                    Delete JobPosting
                </button>
                <button
                    className="candidates-btn"
                    onClick={() => {
                        if (btnIsClicked === true) setBtnIsClicked(false);
                        else setBtnIsClicked(true);
                    }}
                >
                    See candidates
                </button>
                <div className="content">
                    {btnIsClicked && <CandidateList jobPosting={jobPosting} />}
                </div>
            </div>
            {isClicked && <EditJobPosting jobPosting={jobPosting} />}
        </div>
    );
}

export default JobPosting;
