import { React, useState, useEffect } from "react";
import axios from "axios";
import Candidate from "./Candidate";
import AddCandidate from "./AddCandidate";

function CandidateList({ jobPosting }) {
    const [candidates, setCandidates] = useState([]);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const FetchData = async () => {
            try {
                const response = await axios.get(
                    "/jobpostings/" + jobPosting.id + "/candidates"
                );
                setCandidates(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        FetchData();
    }, [candidates]);
    return (
        <div>
            <button
                className="add-btn"
                onClick={() => {
                    if (isClicked === true) setIsClicked(false);
                    else setIsClicked(true);
                }}
            >
                Add a new candidate
            </button>
            {isClicked && <AddCandidate jobPosting={jobPosting} />}

            {candidates.length === 0 && (
                <h1>You currently haven't added any candidates</h1>
            )}
            {candidates.length > 0 &&
                candidates.map((candidate) => (
                    <div key={candidate.id}>
                        <Candidate
                            jobPosting={jobPosting}
                            candidate={candidate}
                        />
                    </div>
                ))}
        </div>
    );
}

export default CandidateList;
