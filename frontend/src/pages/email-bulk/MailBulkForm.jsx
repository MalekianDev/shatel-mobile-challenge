import { useState } from "react";
import { 
    Box,
    Paper,
    Stack,
    TextField,
    Button,
    Typography,
    Alert
} from "@mui/material";
import { createMailBulk } from "../../api/MailBulk";

export default function MailBulkForm({ selectedTemplateId, onSuccess }) {
    const [formData, setFormData] = useState({
        subject: '',
        file: '',
        template: selectedTemplateId,
    });
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setFormData(prevState => ({
                ...prevState,
                file: file
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
    
        try {
          if (!formData.file || !formData.subject || !formData.template) {
            throw new Error('All fields are required.');
          }

          // Create FormData object
          const formDataToSend = new FormData();
          formDataToSend.append('subject', formData.subject);
          formDataToSend.append('file', formData.file);
          formDataToSend.append('template', formData.template);

          // Call API
          await createMailBulk(formDataToSend);

          if (onSuccess) {
            onSuccess();
          }
        } catch (err) {
          setError(err.message || 'An error occurred!');
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '60%', margin: 'auto', padding: '50px' }}>
            <Paper sx={{ padding: "10px" }}>
                <h1>Create a bulk mail:</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Stack spacing={3} sx={{ paddingTop: '8px' }}>
                        <TextField
                            fullWidth
                            label="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                        <Button component="label">
                            Select File
                            <input type="file" name="file" accept=".csv" hidden onChange={handleFileChange} />
                        </Button>
                        {fileName && (
                            <Typography variant="body2" color="textSecondary">
                                Selected file: {fileName}
                            </Typography>
                        )}
                        {error && (
                            <Alert severity="error">{error}</Alert>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Create Bulk Mail'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}