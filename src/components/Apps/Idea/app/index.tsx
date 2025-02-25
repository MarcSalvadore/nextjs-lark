"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    TablePagination, IconButton, Button, Fab, CircularProgress 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./Idea.module.css";

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
    const [loadingToken, setLoadingToken] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
    const [loadingUpdate, setLoadingUpdate] = useState<string | null>(null);
    const [pageToken, setPageToken] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            let url = `./api/getData?page_size=${rowsPerPage}`;
            if (pageToken) url += `&page_token=${pageToken}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Gagal mengambil data");
            
            const result = await response.json();
            setRecords(result.data.items);
            setTotal(result.data.total);
            setPageToken(result.data.has_more ? result.data.next_page_token : null); // Simpan token jika ada
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [rowsPerPage, page]);

    // Fetch authentication token
    const fetchToken = async () => {
        setLoadingToken(true);
        setError(null);
        console.log("Fetching authentication token...");

        try {
            const response = await fetch("./api/getToken");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch token");
            }

            setToken(data.app_access_token);
            console.log("Token fetched:", data.app_access_token);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoadingToken(false);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setPageToken(newPage > page ? pageToken : null); // Use page token to fetch next page
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        setRecords([]);
    };

    // Handle update
    const updateData = (record_id: string) => {
        setLoadingUpdate(record_id);
        console.log("Opening update tab for record:", record_id);
        router.push(`./update?record_id=${record_id}`);
    };

    // Handle delete
    const deleteData = async (record_id: string) => {
        setLoadingDelete(record_id);
        console.log("Deleting record with ID:", record_id);
    
        try {
            const response = await fetch(`./api/deleteData?record_id=${record_id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete record");
            }

            setRecords((prev) => prev.filter((record) => record.record_id !== record_id));
            console.log("Delete successful");
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setLoadingDelete(null);
        }
    };    

    return (
        <div>
            <Card className="rmui-card" sx={{ boxShadow: "none", borderRadius: "7px", mb: "20px", padding: "20px", width: "22%" }}>
                <div className={styles.parent}>
                    <h4 className={styles.text}>Total Records: {total}</h4>
                    <Fab size="medium" color="primary" onClick={() => router.push("./create")}>
                        <AddIcon sx={{ color: "#fff" }} />
                    </Fab>
                </div>
            </Card>

            <div className="flex items-center justify-between gap-2">
                <Button onClick={fetchToken} variant="contained" sx={{ color: "#fff !important", mb: 4 }}>
                    {loadingToken ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Fetch Token"}
                </Button>
                {token && <p className="text-black text-xl mt-4">Token: {token}</p>}
                {error && <p className="text-red-500 text-xl mt-4">Error: {error}</p>}
            </div>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead className="bg-primary-50">
                        <TableRow>
                            {["Record Id", "Name", "Text", "Status", "Attempts", "Action"].map((head) => (
                                <TableCell key={head} sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "18px" }}>
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.record_id}</TableCell>
                                    <TableCell>{record.fields.Name}</TableCell>
                                    <TableCell>{record.fields.Text}</TableCell>
                                    <TableCell>
                                        <div className={`trezo-badge ${record.fields.Status}`}>
                                            {record.fields.Status}
                                        </div>
                                    </TableCell>
                                    <TableCell>{record.fields.Attempts}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => updateData(record.record_id)}>
                                            {loadingUpdate === record.record_id ? <CircularProgress size={20} /> : <EditIcon />}
                                        </IconButton>
                                        <IconButton color="error" onClick={() => deleteData(record.record_id)}>
                                            {loadingDelete === record.record_id ? <CircularProgress size={20} /> : <DeleteIcon />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}