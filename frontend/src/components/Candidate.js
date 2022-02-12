import { React, useState, useEffect } from "react";
import axios from "axios";
import EditCandidate from "./EditCandidate";

function Candidate({ jobPosting, candidate }) {
    const [isClicked, setIsClicked] = useState(false);

    const deleteCandidate = () => {
        console.log(candidate);
        axios.delete(
            "/jobpostings/" + jobPosting.id + "/candidates/" + candidate.id
        );
    };
    return (
        <div>
            <div className="card">
                <div className="candidate-card">
                    <div
                        className="candidate-info"
                        onClick={() => {
                            if (isClicked === true) setIsClicked(false);
                            else setIsClicked(true);
                        }}
                    >
                        <h4>{candidate.name}</h4>
                        <h5>{candidate.cv}</h5>
                        <h5>{candidate.email}</h5>
                    </div>
                    <button className="delete-btn" onClick={deleteCandidate}>
                        Delete Candidate
                    </button>
                </div>
                {isClicked && (
                    <EditCandidate
                        jobPosting={jobPosting}
                        candidate={candidate}
                    />
                )}
            </div>
        </div>
    );
}

export default Candidate;
