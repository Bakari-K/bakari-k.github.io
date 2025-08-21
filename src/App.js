import React, { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  CardMedia
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Email,
  AcUnit,
  Star,
  CallSplit,
  Launch,
  Code,
  Work,
  Person,
  Grass,
  School,
  Groups,
  EmojiEvents
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      marginBottom: '2rem',
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Replace with your GitHub username
  const githubUsername = 'Bakari-K';

  // Experience data
  const experienceData = [
    {
      title: "Undergraduate Researcher",
      company: "Gator Glaciology Lab",
      period: "August 2025 - Present",
      description: "Using novel geophysical and machine learning techniques to map the cavities beneath Antarctica’s ice shelves. Utilizing Bayesian statistics and Markov chain Monte Carlo approaches to analyze subglacial environments.",
      icon: <AcUnit />,
    },
    {
      title: "Undergraduate Researcher",
      company: "GatorSense - The Machine Learning and Sensing Lab",
      period: "June 2025 - Present",
      description: "Developing a machine learning application for estimating the phenotypes of plant roots from minirhizotron images. Utilizing scikit-learn, OpenCV, and NumPy for algorithmic analysis through classicical machine learning approaches. Accelerating training through Linux commands ran on the HiPerGator supercomputer.",
      icon: <Grass />,
    }
  ];

  // Leadership & Involvement data
  const leadershipData = [
    {
      title: "General Body Member",
      company: "National Society of Black Engineers",
      period: "August 2024 - Present",
      description: "General body member of NSBE. Have helped conduct and organize various volunteering events and initiatives, such as volunteering at Gainesville's Porter's Quarters community farm, and setting up a food drive with Food4Kids.",
      icon: <Groups />,
    },
    {
      title: "Pre-professional Director",
      company: "Trailblazers Initiative",
      period: "April 2025 - Present",
      description: "Leading initiatives to support underrepresented students in STEM through mentorship, workshops, and community building. Organizing events to connect students with industry professionals and resources",
      icon: <School />,
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const octokit = new Octokit();
        
        const response = await octokit.rest.repos.listForUser({
          username: githubUsername,
          sort: 'updated',
          per_page: 6,
        });

        const filteredProjects = response.data
          .filter(repo => !repo.fork && repo.description)
          .sort((a, b) => b.stargazers_count - a.stargazers_count);

        // Fetch languages and check for images for each project
        const projectsWithDetails = await Promise.all(
          filteredProjects.map(async (project) => {
            try {
              // Fetch languages
              const languagesResponse = await octokit.rest.repos.listLanguages({
                owner: githubUsername,
                repo: project.name,
              });

              // Check for image files in root directory
              let projectImage = null;
              try {
                const contentsResponse = await octokit.rest.repos.getContent({
                  owner: githubUsername,
                  repo: project.name,
                  path: '',
                });

                const imageFiles = contentsResponse.data.filter(file => 
                  file.name.toLowerCase().endsWith('.png') && 
                  file.type === 'file'
                );

                if (imageFiles.length > 0) {
                  projectImage = `https://raw.githubusercontent.com/${githubUsername}/${project.name}/main/${imageFiles[0].name}`;
                }
              } catch (imageError) {
                // Image check failed, continue without image
                console.log(`No image found for ${project.name}`);
              }

              return {
                ...project,
                languages: languagesResponse.data,
                projectImage
              };
            } catch (detailError) {
              console.error(`Error fetching details for ${project.name}:`, detailError);
              return {
                ...project,
                languages: {},
                projectImage: null
              };
            }
          })
        );

        setProjects(projectsWithDetails);
      } catch (err) {
        setError('Failed to fetch GitHub projects. Please check the username and try again.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [githubUsername]);

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e',
      Python: '#3776ab',
      TypeScript: '#3178c6',
      Java: '#ed8b00',
      'C++': '#00599c',
      React: '#61dafb',
      Vue: '#4fc08d',
      HTML: '#e34f26',
      CSS: '#1572b6',
      Go: '#00add8',
      Rust: '#dea584',
      Swift: '#fa7343',
      Kotlin: '#7f52ff',
      'C#': '#239120',
      PHP: '#777bb4',
      Ruby: '#cc342d',
      Dart: '#0175c2',
      Scala: '#dc322f',
      Shell: '#89e051',
      Dockerfile: '#384d54'
    };
    return colors[language] || '#667eea';
  };

  const getTopLanguages = (languages) => {
    const entries = Object.entries(languages);
    const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
    
    return entries
      .sort((a, b) => b[1] - a[1]) // Sort by bytes (descending)
      .slice(0, 4) // Take top 4 languages
      .map(([name, bytes]) => ({
        name,
        percentage: ((bytes / total) * 100).toFixed(1)
      }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '3rem',
              }}
            >
              BK
            </Avatar>
            <Typography variant="h1" component="h1" gutterBottom>
              Bakari Kerr
            </Typography>
            <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Computer Science undergraduate student at the University of Florida, passionate about full-stack development, data science, and machine learning.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                href={`https://github.com/${githubUsername}`}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
                startIcon={<GitHub />}
              >
                View GitHub
              </Button>
              <Button
                variant="contained"
                size="large"
                href="https://www.linkedin.com/in/bakari-kerr"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
                startIcon={<LinkedIn />}
              >
                Follow Me 
              </Button>
            </Box>
          </Container>
        </Box>

        {/* About Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
            About Me
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" component="p" sx={{ mb: 3, lineHeight: 1.8, color: 'text.secondary' }}>
              I'm a dedicated software engineer with a passion for crafting efficient, 
              scalable solutions. With expertise in modern web technologies including 
              React, Node.js, and cloud platforms, I enjoy tackling complex problems 
              and turning ideas into reality.
            </Typography>
            <Typography variant="h6" component="p" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              When I'm not coding, you can find me exploring new technologies, 
              contributing to open-source projects, or sharing knowledge with the 
              developer community. I believe in writing clean, maintainable code 
              and following industry best practices.
            </Typography>
          </Paper>
        </Container>

        {/* Experience Section */}
        <Box sx={{ bgcolor: 'background.default', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
              Experience
            </Typography>
            <Grid container spacing={4}>
              {experienceData.map((exp, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {exp.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3">
                            {exp.title}
                          </Typography>
                          <Typography color="primary" variant="subtitle2">
                            {exp.company}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={exp.period}
                        size="small"
                        sx={{ mb: 2 }}
                        color="secondary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {exp.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Projects Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
            Featured Projects
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={60} />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}
          
          {!loading && !error && (
            <Grid container spacing={4}>
              {projects.map((project) => {
                const topLanguages = getTopLanguages(project.languages);
                
                return (
                  <Grid item xs={12} md={6} lg={4} key={project.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      width: '100%' // Ensure consistent width
                    }}>
                      {project.projectImage && (
                        <CardMedia
                          component="img"
                          height="600"
                          image={project.projectImage}
                          alt={`${project.name} preview`}
                          sx={{
                            objectFit: 'cover',
                            borderRadius: '16px 16px 0 0'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {project.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            mb: 2, 
                            lineHeight: 1.6
                          }}
                        >
                          {project.description || 'No description available'}
                        </Typography>
                        
                        {/* Languages Section */}
                        {topLanguages.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Languages:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {topLanguages.map((lang) => (
                                <Chip
                                  key={lang.name}
                                  size="small"
                                  label={lang.name}
                                  sx={{
                                    bgcolor: getLanguageColor(lang.name),
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <Star fontSize="small" />
                            <Typography variant="body2">{project.stargazers_count}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <CallSplit fontSize="small" />
                            <Typography variant="body2">{project.forks_count}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<Launch />}
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Project
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>

        {/* Leadership & Involvement Section */}
        <Box sx={{ bgcolor: 'background.default', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
              Leadership & Involvement
            </Typography>
            <Grid container spacing={4}>
              {leadershipData.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {item.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3">
                            {item.title}
                          </Typography>
                          <Typography color="primary" variant="subtitle2">
                            {item.company}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={item.period}
                        size="small"
                        sx={{ mb: 2 }}
                        color="secondary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Contact Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: 'grey.900',
            color: 'white',
            py: 6,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" component="h3" gutterBottom>
              Let's Connect
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
              Feel free to connect with me on LinkedIn or check out my projects on GitHub!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              <IconButton
                color="inherit"
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                size="large"
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <GitHub />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://linkedin.com/in/bakari-kerr"
                target="_blank"
                rel="noopener noreferrer"
                size="large"
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
            <Divider sx={{ bgcolor: 'grey.700', mb: 3 }} />
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 Bakari Kerr
            </Typography>
          </Container>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;