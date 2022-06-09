import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, FormControl, TextField, Typography, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";

const DEFAULT_SHORT_HELPER = "Shortened URL Example: localhost:3000/<short>";

function ShortenForm() {
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [expiry, setExpiry] = useState(1);
    const [shortTitle, setShortTitle] = useState("");
    const [resultShort, setResultShort] = useState("");

    const [urlHelper, setUrlHelper] = useState("");
    const [urlError, setUrlError] = useState(false);
    const [shortHelper, setShortHelper] = useState(DEFAULT_SHORT_HELPER);
    const [shortError, setShortError] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setUrlError(false);
        setUrlHelper("");

        setShortError(false);
        setShortHelper(DEFAULT_SHORT_HELPER);

        setShortTitle("");
        setResultShort("");

        if (url == "") {
            setUrlError(true);
            setUrlHelper("Please enter a URL");
            return;
        }

        setLoading(true);
        axios
            .post("http://localhost:8080/shorten", {
                url: url.trim(),
                short: shortUrl.trim(),
                expiry: expiry,
            })
            .then((res) => {
                setUrl("");
                setShortUrl("");
                setExpiry(1);
                setLoading(false);
                
                setShortTitle("Short URL (expires in " + res.data.expiry + " hrs)");
                setResultShort(res.data.short);
                // toast.success("URL shortened successfully");
            })
            .catch((err) => {
                setLoading(false);
                let errMessage = err.response.data.error;
                if(errMessage === "Cannot parse JSON") {
                    setUrl("");
                    setShortUrl("");
                    setExpiry(1);
                    toast.error("Could not shorten URL. Please try again.");
                } else if (errMessage === "Rate limit exceeded") {
                    toast.error("Please try again in " + err.response.data.rate_limit_reset + " minutes");
                } else if (errMessage === "Invalid URL") {
                    setUrlError(true);
                    setUrlHelper("Please enter a valid URL");
                } else if (errMessage === "This URL cannot be shortened") {
                    setUrlError(true);
                    setUrlHelper(errMessage);
                } else if (errMessage === "URL custom short is already in use") {
                    setShortError(true);
                    setShortHelper(errMessage);
                } else {
                    toast.error(errMessage + ". Please try again");
                }
            });
    };

    return (
        <Container maxWidth="sm" sx={{mt: 15}}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <TextField
                        onChange={(e) => setUrl(e.target.value)}
                        label="URL"
                        value={url}
                        error={urlError}
                        helperText={urlHelper}
                        variant="outlined"
                        required
                        
                    />
                    <TextField
                        sx={{ mt: 3 }}
                        onChange={(e) => setShortUrl(e.target.value)}
                        label="Short"
                        value={shortUrl}
                        error={shortError}
                        helperText={shortHelper}
                        variant="outlined"
                    />
                    <TextField
                        sx={{ mt: 3 }}
                        type="number"
                        inputProps={{ min: 1 }}
                        onChange={(e) => {
                            var value = parseInt(e.target.value, 10);
                            if (value < 1) value = 1;

                            setExpiry(value);
                        }}
                        label="Expiry (in hours)"
                        value={expiry}
                        variant="outlined"
                    />
                    <Box textAlign="center">
                        <LoadingButton
                            variant="contained"
                            type="submit"
                            loading={loading}
                            // onClick={() => setLoading(true)}
                            sx={{ display: "inline-block", mt: 3, bgcolor: "#328CC1" }}
                        >
                            Shorten
                        </LoadingButton>
                    </Box>
                </FormControl>
            </form>
            <Box textAlign="center" sx={{mt: 3}}>
            <Typography variant="h6" component="p">{shortTitle}</Typography>
            <Link href={resultShort} target="_blank" underline="hover" variant="body1" rel="noopener noreferrer">{resultShort}</Link>
            </Box>
        </Container>
    );
}

export default ShortenForm;
