import { React, useState, useEffect } from "react";
import axios from "axios";

function EditCandidate({ jobPosting, candidate }) {
    const [editedCandidate, setEdtedCandidate] = useState(candidate);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(candidate);
        axios
            .put(
                "/jobpostings/" + jobPosting.id + "/candidates/" + candidate.id,
                editedCandidate
            )
            .then((response) => {
                console.log(response.status);
            })
            .catch((error) => {
                console.log(error.response);
            });
        setIsSaved(true);
    };

    if (isSaved === false)
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
                                defaultValue={candidate.name}
                                onChange={(e) =>
                                    (editedCandidate.name = e.target.value)
                                }
                            />
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="abc@def.com"
                                defaultValue={candidate.email}
                                onChange={(e) =>
                                    (editedCandidate.email = e.target.value)
                                }
                            />
                            <label>CV</label>
                            <textarea
                                rows="25"
                                cols="100"
                                placeholder="Write the CV here"
                                defaultValue={candidate.cv}
                                onChange={(e) =>
                                    (editedCandidate.cv = e.target.value)
                                }
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
    else return <h3>Changes saved succesfully</h3>;
}

export default EditCandidate;
