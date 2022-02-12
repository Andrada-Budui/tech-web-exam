import { React, useState, useEffect } from "react";
import axios from "axios";

function AddCandidate({ jobPosting }) {
    const [candidate, setCandidate] = useState({
        name: "",
        cv: "",
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(candidate);
        axios
            .post("/jobpostings/" + jobPosting.id + "/candidates", candidate)
            .then((response) => {
                console.log(response.status);
            })
            .catch((error) => {
                console.log(error.response);
            });
        e.target.reset();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="inputs">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Candidate's name"
                            onChange={(e) => (candidate.name = e.target.value)}
                        />
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="abc@def.com"
                            onChange={(e) => (candidate.email = e.target.value)}
                        />
                        <label>CV</label>
                        <textarea
                            rows="25"
                            cols="100"
                            placeholder="Write the CV here"
                            onChange={(e) => (candidate.cv = e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <input
                    className="save-btn"
                    type="submit"
                    value="Save Changes"
                />
            </form>
        </div>
    );
}

export default AddCandidate;
