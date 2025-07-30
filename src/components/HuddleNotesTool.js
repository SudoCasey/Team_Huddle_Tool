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
  Switch,
  FormControlLabel,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Shuffle as ShuffleIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

const HuddleNotesTool = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [randomizedOrder, setRandomizedOrder] = useState([]);
  const [notes, setNotes] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Compact UI state
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [teamMembersExpanded, setTeamMembersExpanded] = useState(true);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedTeamMembers = localStorage.getItem('huddleTeamMembers');
    const savedCompactMode = localStorage.getItem('huddleCompactMode');
    const savedTeamMembersExpanded = localStorage.getItem('huddleTeamMembersExpanded');
    
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
    
    // Load compact mode setting
    if (savedCompactMode !== null) {
      setIsCompactMode(JSON.parse(savedCompactMode));
    }
    
    // Load team members expanded state
    if (savedTeamMembersExpanded !== null) {
      setTeamMembersExpanded(JSON.parse(savedTeamMembersExpanded));
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

  // Save compact mode setting to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('huddleCompactMode', JSON.stringify(isCompactMode));
    }
  }, [isCompactMode, isLoaded]);

  // Save team members expanded state to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('huddleTeamMembersExpanded', JSON.stringify(teamMembersExpanded));
    }
  }, [teamMembersExpanded, isLoaded]);

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
      <Paper elevation={3} sx={{ p: isCompactMode ? 2 : 3, mb: isCompactMode ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Team Members
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isCompactMode}
                onChange={(e) => setIsCompactMode(e.target.checked)}
                color="primary"
                size="small"
              />
            }
            label="Compact"
            labelPlacement="start"
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontSize: '0.875rem',
                color: 'text.secondary'
              }
            }}
          />
        </Box>
        <Grid container spacing={isCompactMode ? 1 : 2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Add Team Member"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
              placeholder="Enter team member name"
              size={isCompactMode ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addTeamMember}
              disabled={!newMemberName.trim()}
              size={isCompactMode ? "small" : "medium"}
            >
              Add Member
            </Button>
          </Grid>
        </Grid>

        {teamMembers.length > 0 && (
          <Box sx={{ mt: isCompactMode ? 1 : 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
                   onClick={() => setTeamMembersExpanded(!teamMembersExpanded)}>
                <Typography variant="h6">
                  Current Team ({teamMembers.length} members)
                </Typography>
                <IconButton size="small" sx={{ ml: 1 }}>
                  {teamMembersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={clearAllTeamMembers}
              >
                Clear All
              </Button>
            </Box>
            <Collapse in={teamMembersExpanded}>
              <List dense={isCompactMode}>
                {teamMembers.map((member) => (
                  <ListItem key={member.id} sx={{ py: isCompactMode ? 0.5 : 1 }}>
                    <ListItemText primary={member.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => removeTeamMember(member.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        )}
      </Paper>

      {/* Randomization Controls */}
      <Paper elevation={3} sx={{ p: isCompactMode ? 2 : 3, mb: isCompactMode ? 2 : 3 }}>
        <Typography variant="h5" gutterBottom>
          Randomization
        </Typography>
        <Grid container spacing={isCompactMode ? 1 : 2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ShuffleIcon />}
              onClick={randomizeTeam}
              disabled={teamMembers.length === 0}
              size={isCompactMode ? "small" : "medium"}
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
                  size={isCompactMode ? "small" : "medium"}
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
                  size={isCompactMode ? "small" : "medium"}
                >
                  Export CSV
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {randomizedOrder.length > 0 && (
          <Box sx={{ mt: isCompactMode ? 1 : 2 }}>
            <Typography variant="h6" gutterBottom>
              Randomized Order
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {randomizedOrder.map((memberId, index) => {
                const member = getMemberById(memberId);
                return (
                  <Chip
                    key={memberId}
                    label={`${index + 1}. ${member.name}`}
                    color="primary"
                    variant="outlined"
                    size={isCompactMode ? "small" : "medium"}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Notes Section */}
      {randomizedOrder.length > 0 && (
        <Paper elevation={3} sx={{ p: isCompactMode ? 2 : 3 }}>
          <Typography variant="h5" gutterBottom>
            Notes for Each Team Member
          </Typography>
          <Grid container spacing={isCompactMode ? 1 : 2}>
            {randomizedOrder.map((memberId, index) => {
              const member = getMemberById(memberId);
              
              return (
                <Grid item xs={12} key={memberId}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: isCompactMode ? 1.5 : 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {index + 1}. {member.name}
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={isCompactMode ? 2 : 3}
                        value={notes[memberId] || ''}
                        onChange={(e) => updateNote(memberId, e.target.value)}
                        placeholder="Enter notes for this team member..."
                        variant="outlined"
                        size={isCompactMode ? "small" : "medium"}
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