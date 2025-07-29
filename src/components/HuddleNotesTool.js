import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,

} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Shuffle as ShuffleIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const HuddleNotesTool = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [randomizedOrder, setRandomizedOrder] = useState([]);
  const [notes, setNotes] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load team members from localStorage on component mount
  useEffect(() => {
    const savedTeamMembers = localStorage.getItem('huddleTeamMembers');
    console.log('Loading from localStorage:', savedTeamMembers);
    if (savedTeamMembers) {
      try {
        const parsedMembers = JSON.parse(savedTeamMembers);
        console.log('Parsed members:', parsedMembers);
        setTeamMembers(parsedMembers);
      } catch (error) {
        console.error('Error loading team members from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save team members to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving to localStorage:', teamMembers);
      localStorage.setItem('huddleTeamMembers', JSON.stringify(teamMembers));
    }
  }, [teamMembers, isLoaded]);

  // Add a new team member
  const addTeamMember = () => {
    if (newMemberName.trim()) {
      const newMember = {
        id: Date.now(),
        name: newMemberName.trim(),
      };
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberName('');
      setSnackbar({ open: true, message: 'Team member added and saved!', severity: 'success' });
    }
  };

  // Remove a team member
  const removeTeamMember = (id) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    setRandomizedOrder(randomizedOrder.filter(memberId => memberId !== id));
    const newNotes = { ...notes };
    delete newNotes[id];
    setNotes(newNotes);
    setSnackbar({ open: true, message: 'Team member removed from storage!', severity: 'info' });
  };

  // Clear all team members
  const clearAllTeamMembers = () => {
    setTeamMembers([]);
    setRandomizedOrder([]);
    setNotes({});
    localStorage.removeItem('huddleTeamMembers');
    setSnackbar({ open: true, message: 'All team members cleared!', severity: 'warning' });
  };

  // Randomize team members
  const randomizeTeam = () => {
    if (teamMembers.length === 0) {
      setSnackbar({ open: true, message: 'Please add team members first!', severity: 'warning' });
      return;
    }
    
    const shuffled = [...teamMembers].sort(() => Math.random() - 0.5);
    setRandomizedOrder(shuffled.map(member => member.id));
    setSnackbar({ open: true, message: 'Team order randomized!', severity: 'success' });
  };

  // Auto-save note changes
  const updateNote = (memberId, noteText) => {
    setNotes({
      ...notes,
      [memberId]: noteText
    });
  };

  // Export notes
  const exportNotes = (format) => {
    if (teamMembers.length === 0) {
      setSnackbar({ open: true, message: 'No team members to export!', severity: 'warning' });
      return;
    }

    let content = '';
    const date = new Date().toLocaleDateString();

    if (format === 'txt') {
      content = `Morning Huddle Notes - ${date}\n`;
      content += '='.repeat(50) + '\n\n';
      
      randomizedOrder.forEach((memberId, index) => {
        const member = teamMembers.find(m => m.id === memberId);
        const note = notes[memberId] || 'No notes';
        content += `${index + 1}. ${member.name}\n`;
        content += `   Notes: ${note}\n\n`;
      });
    } else if (format === 'csv') {
      content = 'Name,Notes\n';
      randomizedOrder.forEach(memberId => {
        const member = teamMembers.find(m => m.id === memberId);
        const note = notes[memberId] || '';
        content += `"${member.name}","${note.replace(/"/g, '""')}"\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `huddle-notes-${date}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSnackbar({ open: true, message: `Notes exported as ${format.toUpperCase()} successfully!`, severity: 'success' });
  };

  // Get member by ID
  const getMemberById = (id) => {
    return teamMembers.find(member => member.id === id);
  };

  return (
    <Box>
      {/* Team Member Management */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Team Members
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Add Team Member"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
              placeholder="Enter team member name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addTeamMember}
              disabled={!newMemberName.trim()}
            >
              Add Member
            </Button>
          </Grid>
        </Grid>

        {teamMembers.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">
                Current Team ({teamMembers.length} members)
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={clearAllTeamMembers}
              >
                Clear All
              </Button>
            </Box>
            <List dense>
              {teamMembers.map((member) => (
                <ListItem key={member.id}>
                  <ListItemText primary={member.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeTeamMember(member.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {/* Randomization Controls */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Randomization
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ShuffleIcon />}
              onClick={randomizeTeam}
              disabled={teamMembers.length === 0}
            >
              Randomize Order
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => exportNotes('txt')}
                  disabled={teamMembers.length === 0}
                >
                  Export TXT
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => exportNotes('csv')}
                  disabled={teamMembers.length === 0}
                >
                  Export CSV
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {randomizedOrder.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Randomized Order
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {randomizedOrder.map((memberId, index) => {
                const member = getMemberById(memberId);
                return (
                  <Chip
                    key={memberId}
                    label={`${index + 1}. ${member.name}`}
                    color="primary"
                    variant="outlined"
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Notes Section */}
      {randomizedOrder.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Notes for Each Team Member
          </Typography>
          <Grid container spacing={2}>
            {randomizedOrder.map((memberId, index) => {
              const member = getMemberById(memberId);
              
              return (
                <Grid item xs={12} key={memberId}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {index + 1}. {member.name}
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={notes[memberId] || ''}
                        onChange={(e) => updateNote(memberId, e.target.value)}
                        placeholder="Enter notes for this team member..."
                        variant="outlined"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}



      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HuddleNotesTool; 