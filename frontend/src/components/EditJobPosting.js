import { React, useState } from "react";
import axios from "axios";

function EditJobPosting({ jobPosting }) {
    const [editedJobPosting, setEditedJobPosting] = useState(jobPosting);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put("/jobpostings/" + jobPosting.id, editedJobPosting)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        setIsSaved(true);
    };

    if (isSaved === false)
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="form-content">
                        <div className="inputs">
                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                defaultValue={jobPosting.description}
                                placeholder="Description of job posting"
                                onChange={(e) =>
                                    (editedJobPosting.description =
                                        e.target.value)
                                }
                            />
                            <label>Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                defaultValue={jobPosting.deadline}
                                onChange={(e) =>
                                    (editedJobPosting.deadline = e.target.value)
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
    else return <h3>Changes saved succesfully</h3>;
    // else return null;
    // else return alert("Changes saved succesfully");
}

export default EditJobPosting;
