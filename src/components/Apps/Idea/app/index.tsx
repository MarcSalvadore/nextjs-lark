"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, Button, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./Idea.module.css";
import { DELETE } from "@/app/apps/idea/api/deleteData/route";

interface Record {
  id: string;
  record_id: string;
  fields: {
    Attempts: string;
    Name: string;
    Status: string;
    Text: string;
  };
}

export default function Home() {
    const [total, setTotal] = useState<number>(0);
    const [records, setRecords] = useState<Record[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
    const [loadingUpdate, setLoadingUpdate] = useState<string | null>(null);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    // Fetch authentication token
    const fetchToken = async () => {
        setLoading(true);
        setError(null);
        console.log("Fetching authentication token...");

        try {
            const response = await fetch("./api/getToken");
            const data = await response.json();

            if (response.ok) {
                setToken(data.app_access_token);
                console.log("Token fetched:", data.app_access_token);
        } else {
            setError(data.error || "Failed to fetch token");
        }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
            } finally {
            setLoading(false);
        }
    };

    // Fetch data based on pagination
    const fetchData = async (page: number, rowsPerPage: number) => {
        setLoading(true);
        setError(null);
        console.log(`Fetching data for page: ${page}, rowsPerPage: ${rowsPerPage}`);

        try {
            const response = await fetch(`./api/getData?page=${page + 1}&limit=${rowsPerPage}`);
            const contentType = response.headers.get("content-type");

            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid response format (not JSON)");
            }
            const result = await response.json();
            setRecords(result.data.items);
            setTotal(result.data.total);

        } catch (error) {
         console.error("Error fetching data:", error);
            setError("Failed to fetch data");

        } finally {
            setLoading(false);
        }
    };

    // Fetch data when page or rowsPerPage changes
    useEffect(() => {
        fetchData(page, rowsPerPage);
    }, [page, rowsPerPage]);

    // Handle update
    const updateData = (record_id: string) => {
        setLoadingUpdate(record_id);
        console.log("Opening update tab for record:", record_id);
        
        // Navigate to update page (example: /update/[recordId])
        router.push(`./update?record_id=${record_id}`);
    };

    const deleteData = async (record_id: string) => {
        setLoadingDelete(true);
        console.log("Deleting record with ID:", record_id);
    
        try {
        const response = await fetch(`./api/deleteData?record_id=${record_id}`, {
            method: "DELETE",
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete record");
        }
    
        setRecords(records.filter((record) => record.record_id !== record_id));
        console.log("Delete successful");
        } catch (error) {
        console.error("Delete error:", error);
        } finally {
        setLoadingDelete(false);
        }
    };    

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Card
                sx={{
                    boxShadow: "none",
                    borderRadius: "7px",
                    mb: "20px",
                    padding: { xs: "18px", sm: "20px", lg: "25px" },
                    width: "22%", // Adjust width (can use maxWidth)
                }}
                className="rmui-card"
            >
                {/* Align Total Records & Add Button in One Row */}
                <div className={styles.parent}>
                    <h4 className={styles.text}>Total Records: {total}</h4>
                    <Fab 
                        size="medium" 
                        color="primary" 
                        aria-label="add"
                        onClick={() => router.push("./create")}
                    >
                        <AddIcon sx={{ color: "#fff" }} />
                    </Fab>
                </div>
            </Card>

            {/* Get Token Button */}
            <div className="flex items-center justify-between gap-2">
                <Button 
                    onClick={fetchToken}
                    variant="contained"
                    sx={{ 
                        color: "#fff !important",
                        mb: 4
                    }}
                >
                    Fetch Token
                </Button>
                {token && <p className="flex justify-center mt-4 text-xl text-black">Token: {token}</p>}
                {error && <p className="flex justify-center mt-4 text-xl text-red-500">Error: {error}</p>}
            </div>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead 
                        sx={{
                            padding: { xs: "18px", sm: "20px", lg: "25px" },
                        }}
                        className="bg-primary-50 "
                    >
                        <TableRow>
                            <TableCell 
                                sx={{
                                    fontWeight: "500",
                                    padding: "10px 20px",
                                    fontSize: "18px",
                                }}
                                className="text-black border-bottom"
                            >
                                Record Id
                            </TableCell>
                            <TableCell 
                                sx={{
                                    fontWeight: "500",
                                    padding: "10px 20px",
                                    fontSize: "18px",
                                }}
                                className="text-black border-bottom"
                            >
                                Name
                            </TableCell>
                            <TableCell 
                                sx={{
                                    fontWeight: "500",
                                    padding: "10px 20px",
                                    fontSize: "18px",
                                }}
                                className="text-black border-bottom"
                            >
                                Text
                            </TableCell>
                            <TableCell 
                                sx={{
                                    fontWeight: "500",
                                    padding: "10px 20px",
                                    fontSize: "18px",
                                }}
                                className="text-black border-bottom"
                            >
                                Status
                            </TableCell>
                            <TableCell 
                                sx={{
                                    fontWeight: "500",
                                    padding: "10px 20px",
                                    fontSize: "18px",
                                }}
                                className="text-black border-bottom"
                            >
                                Attempts
                            </TableCell>
                            <TableCell 
                                sx={{
                                    fontWeight: "500",
                                    padding: "10px 20px",
                                    fontSize: "18px",
                                }}
                                className="text-black border-bottom"
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
                        <TableRow key={record.id}>
                            <TableCell
                                sx={{
                                    padding: "15px 20px",
                                    fontSize: "14px",
                                }}
                                className="text-black border-bottom"
                            >
                                {record.record_id}
                            </TableCell>
                            <TableCell
                                sx={{
                                    padding: "15px 20px",
                                    fontSize: "14px",
                                }}
                                className="text-black border-bottom"
                            >
                                {record.fields.Name}
                            </TableCell>
                            <TableCell
                                sx={{
                                    padding: "15px 20px",
                                    fontSize: "14px",
                                }}
                                className="text-black border-bottom"
                            >
                                {record.fields.Text}
                            </TableCell>
                            <TableCell
                                sx={{
                                padding: "15px 20px",
                                fontSize: "14px",
                                }}
                                className="text-black border-bottom"
                            >
                                <div className={`trezo-badge ${record.fields.Status}`}>
                                    {record.fields.Status}
                                </div>
                            </TableCell>
                            <TableCell
                                sx={{
                                    padding: "15px 20px",
                                    fontSize: "14px",
                                }}
                                className="text-black border-bottom"
                            >
                                {record.fields.Attempts}
                            </TableCell>
                            <TableCell>
                            <IconButton color="primary" onClick={() => updateData(record.record_id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => deleteData(record.record_id)}>
                                <DeleteIcon />
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: records.length }]}
                component="div"
                count={records.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}