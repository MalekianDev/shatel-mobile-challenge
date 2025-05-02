import { useEffect, useState } from "react";
import { 
    Box, 
    List, 
    ListItem, 
    ListItemText, 
    Paper, 
    TextField, 
    Stack, 
    TextareaAutosize, 
    Button,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
} from "@mui/material";

import { getMailTemplates, createMailTemplate } from "../../api/mailTemplate";

export default function MailTemplateList({ onSelectTemplate }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        body: "",
      });

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await getMailTemplates();
                setTemplates(response.data);
            } catch (error) {
                console.error("Failed to fetch mail templates:", error);
            }
        };

        fetchTemplates();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleSnackClose = (_, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackOpen(false);
      };

    const handleTemplateClick = (id) => {
        setSelectedTemplateId(id);
        if (onSelectTemplate) {
            onSelectTemplate(id);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            const response = await createMailTemplate(formData);
            setDialogOpen(false);
            setSnackOpen(true);
            
            // Refresh the templates list
            const updatedTemplates = await getMailTemplates();
            setTemplates(updatedTemplates.data);
    
            // Set the new template as selected
            setSelectedTemplateId(response.data.id);
        } catch (err) {
            console.error('Error creating template:', err);
            setError('Failed to create template.');
        } finally {
            setLoading(false);
        }
    };

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);

    return (
        <Box sx={{ width: '60%', margin: 'auto', padding: '50px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
                    <Alert
                    onClose={handleSnackClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    >
                    New template created!
                    </Alert>
                </Snackbar>
            </div>
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create new template</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3} sx={{ paddingTop: '8px' }}>
                            <TextField
                                fullWidth
                                label="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <TextareaAutosize
                                name="body"
                                value={formData.body}
                                onChange={handleChange}
                                minRows={5}
                                placeholder="Send email to {{ email }}, the national ID of the {{ email }} is {{ national_id }}."
                                required
                            />
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Paper sx={{ padding: "10px" }}>
                <h1>Select a template:</h1>
                <List>
                    {templates.map((template, index) => (
                        <ListItem 
                            key={index} 
                            button 
                            onClick={() => handleTemplateClick(template.id)}
                            sx={{
                                cursor: 'pointer',
                                backgroundColor: selectedTemplateId === template.id ? 'lightgray' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'lightblue',
                                }
                            }}
                        >
                            <ListItemText 
                                primary={template.name} 
                                secondary={template.body} 
                                sx={{
                                    '&::before': {
                                        content: selectedTemplateId === template.id ? '"✔ "' : '""',
                                        color: 'green',
                                        marginRight: '8px',
                                    }
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleDialogOpen}
                    fullWidth
                >
                    Or Create New One!
                </Button>
            </Paper>
        </Box>
    );
}
