import { React, useState } from "react";
import axios from "axios";

function AddJobPosting() {
    const [jobPosting, setJobPosting] = useState({
        description: "",
        deadline: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(jobPosting);
        axios
            .post("/jobpostings/", jobPosting)
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
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Description of job posting"
                            onChange={(e) =>
                                (jobPosting.description = e.target.value)
                            }
                        />
                        <label>Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            onChange={(e) =>
                                (jobPosting.deadline = e.target.value)
                            }
                        />
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

export default AddJobPosting;
