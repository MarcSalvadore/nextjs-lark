"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from 'next/link';
import {
    Grid,
    Card,
    Box,
    Typography,
    FormControl,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
} from "@mui/material";

export default function Update() {
    const [loading, setLoading] = useState<boolean>(false);
    const [text, setText] = useState("");
    const [name, setName] = useState("");
    const [attempts, setAttempts] = useState<number>(0);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get record_id from URL params
    const record_id = searchParams.get("record_id");

    // Fetch existing record data
    useEffect(() => {
        const fetchRecord = async () => {
            if (!record_id) return;
    
            try {
                const response = await fetch(`/apps/idea/api/getRecord?record_id=${record_id}`);
                const result = await response.json();
    
                console.log("API Response:", result); // ✅ Debugging log
    
                // Extract correct nested structure
                if (!result.data?.data?.record?.fields) {
                    throw new Error("Record data is missing or invalid");
                }
    
                // Assign the values
                setName(result.data.data.record.fields.Name || "");
                setText(result.data.data.record.fields.Text || "");
                setAttempts(Number(result.data.data.record.fields.Attempts) || 0);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchRecord();
    }, [record_id]);
    

    // Update record
    const updateRecord = async () => {
        setLoading(true);
        try {
            const requestBody = {
                records: [
                    {
                        id: record_id, // Ensure record_id is included
                        fields: {
                            Text: text,
                            Name: name,
                            Attempts: attempts,
                            Status: "Updated",
                        },
                    },
                ],
            };
    
            const response = await fetch(`/apps/idea/api/updateData?record_id=${record_id}`, { 
                method: "POST", // Ensure it matches backend
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update record");
            }
    
            console.log("Record updated successfully!");
            alert("Record updated!");
    
            // Redirect back to home page
            router.push("/");
        } catch (error) {
            console.error("Update record error:", error);
        } finally {
            setLoading(false);
        }
    };    

    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Update Records</h5>

                <ul className="breadcrumb">
                <li>
                    <NextLink href="/dashboard/ecommerce/">
                    <i className="material-symbols-outlined">home</i>
                    Dashboard
                    </NextLink>
                </li>
                <li>Apps</li>
                <li>Idea</li>
                </ul>
            </div>
            <Box component="form">
                <Card
                sx={{
                    boxShadow: "none",
                    borderRadius: "7px",
                    mb: "25px",
                    padding: { xs: "18px", sm: "20px", lg: "25px" },
                }}
                className="rmui-card"
                >
                <Box
                    sx={{
                    mb: "25px",
                    }}
                >
                    <Typography
                    variant="h3"
                    sx={{
                        fontSize: { xs: "16px", md: "18px" },
                        fontWeight: 700,
                    }}
                    className="text-black"
                    >
                    Record Form
                    </Typography>
                </Box>

                <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 2, lg: 3 }}
                >
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                    <Box>
                        <FormControl fullWidth>
                        <Typography
                            component="label"
                            sx={{
                            fontWeight: "500",
                            fontSize: "14px",
                            mb: "10px",
                            display: "block",
                            }}
                            className="text-black"
                        >
                            Name
                        </Typography>

                        <TextField
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            label="State Your Name"
                            variant="filled"
                            id="name"
                            name="name"
                            sx={{
                            "& .MuiInputBase-root": {
                                border: "1px solid #D5D9E2",
                                backgroundColor: "#fff",
                                borderRadius: "7px",
                            },
                            "& .MuiInputBase-root::before": {
                                border: "none",
                            },
                            "& .MuiInputBase-root:hover::before": {
                                border: "none",
                            },
                            }}
                        />
                        </FormControl>
                    </Box>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} xl={12}>
                    <Box>
                        <FormControl fullWidth>
                        <Typography
                            component="label"
                            sx={{
                            fontWeight: "500",
                            fontSize: "14px",
                            mb: "10px",
                            display: "block",
                            }}
                            className="text-black"
                        >
                            Description
                        </Typography>

                        <TextField
                            value={text} 
                            onChange={(e) => setText(e.target.value)} 
                            label="Enter Idea Description"
                            variant="filled"
                            type="text"
                            id="text"
                            name="text"
                            sx={{
                            "& .MuiInputBase-root": {
                                border: "1px solid #D5D9E2",
                                backgroundColor: "#fff",
                                borderRadius: "7px",
                            },
                            "& .MuiInputBase-root::before": {
                                border: "none",
                            },
                            "& .MuiInputBase-root:hover::before": {
                                border: "none",
                            },
                            }}
                        />
                        </FormControl>
                    </Box>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} xl={12}>
                    <Box>
                        <FormControl fullWidth>
                        <Typography
                            component="label"
                            sx={{
                            fontWeight: "500",
                            fontSize: "14px",
                            mb: "10px",
                            display: "block",
                            }}
                            className="text-black"
                        >
                            Attempts
                        </Typography>

                        <TextField
                            value={attempts} 
                            onChange={(e) => setAttempts(Number(e.target.value))} 
                            label="How Many Attempts did You Take?"
                            variant="filled"
                            type="attempts"
                            id="attempts"
                            name="attempts"
                            sx={{
                            "& .MuiInputBase-root": {
                                border: "1px solid #D5D9E2",
                                backgroundColor: "#fff",
                                borderRadius: "7px",
                            },
                            "& .MuiInputBase-root::before": {
                                border: "none",
                            },
                            "& .MuiInputBase-root:hover::before": {
                                border: "none",
                            },
                            }}
                        />
                        </FormControl>
                    </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={12} lg={12} xl={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={updateRecord}
                        sx={{
                            textTransform: "capitalize",
                            borderRadius: "6px",
                            fontWeight: "500",
                            fontSize: "16px",
                            padding: "10px 24px",
                            color: "#fff !important",
                            boxShadow: "none",
                            display: "block",
                            margin: "auto",
                            width: "50%",
                            mt: "10px",
                        }}
                    >
                        Submit
                    </Button>
                    </Grid>
                </Grid>
                </Card>
            </Box>
        </>
    );
}
