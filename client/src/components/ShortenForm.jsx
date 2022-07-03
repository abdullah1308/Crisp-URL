import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Container,
    FormControl,
    TextField,
    Typography,
    Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { useEffect } from "react";

const DEFAULT_SHORT_HELPER = "Shortened URL Example: localhost:3000/<short>";

function ShortenForm() {
    const initialFormValues = { url: "", short: "", expiry: "1" };
    const [formValues, setFormValues] = useState(initialFormValues);
    const [formErrors, setFormErrors] = useState({});

    const initialResponseValues = { title: "", short: "" };
    const [responseValues, setResponseValues] = useState(initialResponseValues);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        var { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validate = (values) => {
        const errors = {};
        if (!values.url) {
            errors.url = "URL is required!";
        }

        let expiry = parseInt(values.expiry, 10);
        if(isNaN(expiry) || expiry < 1) {
            errors.expiry = "Expiry must be 1 or greater!";  
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setResponseValues(initialResponseValues);
        setLoading(true);
    };

    useEffect(() => {
        if (loading === true && Object.keys(formErrors).length === 0) {
            axios
                .post("http://localhost:8080/shorten", {
                    url: formValues.url.trim(),
                    short: formValues.short.trim(),
                    expiry: parseInt(formValues.expiry.trim(), 10),
                })
                .then((res) => {
                    setFormValues(initialFormValues);
                    setLoading(false);
                    setResponseValues({
                        title:
                            "Short URL (expires in " +
                            res.data.expiry +
                            " hrs)",
                        short: res.data.short,
                    });
                })
                .catch((err) => {
                    setLoading(false);
                    let errMessage = err.response.data.error;
                    if (errMessage === "Cannot parse JSON") {
                        setFormValues(initialFormValues);
                        toast.error("Could not shorten URL. Please try again.");
                    } else if (errMessage === "Rate limit exceeded") {
                        toast.error(
                            "Please try again in " +
                                err.response.data.rate_limit_reset +
                                " minutes"
                        );
                    } else if (errMessage === "Invalid URL") {
                        setFormErrors({
                            ...formErrors,
                            url: "Please enter a valid URL",
                        });
                    } else if (errMessage === "This URL cannot be shortened") {
                        setFormErrors({ ...formErrors, url: errMessage });
                    } else if (
                        errMessage === "URL custom short is already in use"
                    ) {
                        setFormErrors({ ...formErrors, short: errMessage });
                    } else {
                        toast.error(errMessage + ". Please try again");
                    }
                });
        } else if (loading === true && Object.keys(formErrors).length !== 0) {
            setLoading(false);
        }
    }, [loading, formValues, formErrors, responseValues, initialFormValues]);

    return (
        <Container maxWidth="sm" sx={{ mt: 15 }}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <TextField
                        name="url"
                        label="URL"
                        placeholder="URL"
                        onChange={handleChange}
                        value={formValues.url}
                        error={"url" in formErrors}
                        helperText={formErrors.url}
                        variant="outlined"
                        required
                    />
                    <TextField
                        name="short"
                        label="Short"
                        placeholder="Short"
                        onChange={handleChange}
                        value={formValues.short}
                        error={"short" in formErrors}
                        helperText={
                            formErrors.short
                                ? formErrors.short
                                : DEFAULT_SHORT_HELPER
                        }
                        variant="outlined"
                        sx={{ mt: 3 }}
                    />
                    <TextField
                        name="expiry"
                        label="Expiry (in hours)"
                        type="number"
                        onChange={handleChange}
                        value={formValues.expiry}
                        error={"expiry" in formErrors}
                        helperText={formErrors.expiry}
                        variant="outlined"
                        sx={{ mt: 3 }}
                        inputProps={{ min: 1 }}
                        required
                    />
                    <Box textAlign="center">
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            variant="contained"
                            sx={{
                                display: "inline-block",
                                mt: 3,
                                bgcolor: "#328CC1",
                            }}
                        >
                            Shorten
                        </LoadingButton>
                    </Box>
                </FormControl>
            </form>
            <Box textAlign="center" sx={{ mt: 3 }}>
                <Typography variant="h6" component="p">
                    {responseValues.title}
                </Typography>
                <Link
                    href={responseValues.short}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    variant="body1"
                >
                    {responseValues.short}
                </Link>
            </Box>
        </Container>
    );
}

export default ShortenForm;
