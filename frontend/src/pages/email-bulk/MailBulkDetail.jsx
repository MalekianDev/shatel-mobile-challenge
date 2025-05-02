import { useState, useEffect } from "react";
import { 
    Box,
    Paper,
    Typography,
    LinearProgress,
    CircularProgress,
    Button,
    Stack,
    IconButton
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CancelIcon from '@mui/icons-material/Cancel';
import { getMailBulkDetail, updateMailBulkStatus, MAIL_BULK_STATUS } from "../../api/MailBulk";

export default function MailBulkDetail({ mailBulkId }) {
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        let intervalId;
        
        const fetchDetail = async () => {
            try {
                if (!mailBulkId) {
                    setError("No mail bulk ID provided.");
                    setLoading(false);
                    return;
                }
                
                // Skip fetching if paused or already completed
                if (isPaused || isCompleted) {
                    return;
                }
                
                const response = await getMailBulkDetail(mailBulkId);
                setDetail(response.data);
                setLoading(false);
                
                // Check if progress is 100%
                const progress = response.data.total_count > 0 
                    ? (response.data.sent_count / response.data.total_count) * 100 
                    : 0;
                
                if (progress >= 100) {
                    setIsCompleted(true);
                    // Clear interval if progress is 100%
                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                }
            } catch (err) {
                setError("Failed to fetch mail bulk details.");
                setLoading(false);
                console.error(err);
            }
        };

        fetchDetail();
        
        // Set up interval to fetch data every 1 second
        if (!isCompleted) {
            intervalId = setInterval(fetchDetail, 1000);
        }
        
        // Clean up interval on component unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [mailBulkId, isPaused, isCompleted]);

    const handlePauseResume = async () => {
        try {
            if (isPaused) {
                await updateMailBulkStatus(mailBulkId, MAIL_BULK_STATUS.RESUME);
            } else {
                await updateMailBulkStatus(mailBulkId, MAIL_BULK_STATUS.PAUSE);
            }
            setIsPaused(!isPaused);
        } catch (err) {
            setError(err.message || "Failed to update mail bulk status");
        }
    };

    const handleCancel = async () => {
        try {
            await updateMailBulkStatus(mailBulkId, MAIL_BULK_STATUS.CANCEL);
            setIsPaused(true);
            setError("Mail bulk has been canceled.");
        } catch (err) {
            setError(err.message || "Failed to cancel mail bulk");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ width: '60%', margin: 'auto', padding: '50px' }}>
                <Paper sx={{ padding: "20px" }}>
                    <Typography color="error" variant="h6">{error}</Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => {
                            setError("");
                            setIsPaused(false);
                        }}
                        sx={{ mt: 2 }}
                    >
                        Retry
                    </Button>
                </Paper>
            </Box>
        );
    }

    if (!detail) {
        return (
            <Box sx={{ width: '60%', margin: 'auto', padding: '50px' }}>
                <Paper sx={{ padding: "20px" }}>
                    <Typography>No details available.</Typography>
                </Paper>
            </Box>
        );
    }

    const progress = detail.total_count > 0 ? (detail.sent_count / detail.total_count) * 100 : 0;

    return (
        <Box sx={{ width: '60%', margin: 'auto', padding: '50px' }}>
            <Paper sx={{ padding: "20px" }}>
                <Typography variant="h4" gutterBottom>Mail Bulk Detail</Typography>
                
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom>Progress</Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton 
                                color="primary" 
                                onClick={handlePauseResume}
                                disabled={isCompleted}
                            >
                                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                            </IconButton>
                            <IconButton 
                                color="error" 
                                onClick={handleCancel}
                                disabled={isCompleted}
                            >
                                <CancelIcon />
                            </IconButton>
                        </Stack>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
                        {Math.round(progress)}%
                        {isCompleted && " (Completed)"}
                        {isPaused && !isCompleted && " (Paused)"}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Box sx={{ mb: 2, minWidth: '30%' }}>
                        <Typography variant="subtitle1">Total Emails</Typography>
                        <Typography variant="h5">{detail.total_count}</Typography>
                    </Box>
                    <Box sx={{ mb: 2, minWidth: '30%' }}>
                        <Typography variant="subtitle1">Sent Emails</Typography>
                        <Typography variant="h5">{detail.sent_count}</Typography>
                    </Box>
                    <Box sx={{ mb: 2, minWidth: '30%' }}>
                        <Typography variant="subtitle1">Duplicate Emails</Typography>
                        <Typography variant="h5">{detail.duplicate_count}</Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}