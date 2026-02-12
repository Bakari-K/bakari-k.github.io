import { useState, useEffect } from 'react';
import { Octokit } from 'octokit';
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
import ParticleBackground from './ParticleBackground';
import SectionDivider from './SectionDivider';
import './App.css';

// Modern tech-forward theme with grey background and orange accents
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2D2D35',
      light: '#3F3F4A',
    },
    secondary: {
      main: '#F97316',
      light: '#FB923C',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F7',
    },
    text: {
      primary: '#2D2D35',
      secondary: '#6B6B75',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '4.5rem',
      letterSpacing: '-0.04em',
      lineHeight: 1.1,
      color: '#2D2D35',
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
      color: '#2D2D35',
      marginBottom: '3rem',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '2rem',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontSize: '1.125rem',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      color: '#2D2D35',
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
      color: '#6B6B75',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(249, 115, 22, 0.12)',
          boxShadow: '0 4px 20px rgba(249, 115, 22, 0.08)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 16px 48px rgba(249, 115, 22, 0.2)',
            borderColor: 'rgba(249, 115, 22, 0.4)',
            backgroundColor: 'rgba(255, 247, 237, 0.8)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontSize: '1rem',
          fontWeight: 600,
          padding: '12px 28px',
          letterSpacing: '-0.01em',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0',
            height: '0',
            borderRadius: '50%',
            background: 'rgba(249, 115, 22, 0.2)',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.6s, height 0.6s',
          },
          '&:hover::before': {
            width: '300px',
            height: '300px',
          },
        },
        contained: {
          boxShadow: '0 2px 12px rgba(249, 115, 22, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(249, 115, 22, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '-0.01em',
        },
      },
    },
  },
});

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const githubUsername = 'Bakari-K';
  
  // Roles to cycle through
  const roles = [
    'an Engineer',
    'a Scientist',
    'a Researcher',
    'a Scholar',
    'a Leader',
    'a Developer',
    'an Innovator'
  ];

  const experienceData = [
    {
      title: "Undergraduate Researcher",
      company: "Gator Glaciology Lab",
      period: "August 2025 - Present",
      description: "Using novel geophysical and geostastical machine learning techniques to map the bedrock beneath Antarctica's ice shelves. Exploring stochastic approaches by combining Markov chain Monte Carlo with Sequential Gaussian Simulation to generate realistic topography that combines mass conservation geophysics with glaciological realism. These approaches allow for climate scientist to more effectively quantify uncertainty in ice sheet models to better predict sea level rise.",
      icon: <AcUnit />,
    },
    {
      title: "Undergraduate Researcher",
      company: "GatorSense - The Machine Learning and Sensing Lab",
      period: "June 2025 - Present",
      description: "Developing a computer vision application for estimating the phenotypes of plant roots from minirhizotron images. Utilizing scikit-learn, OpenCV, and NumPy for algorithmic analysis through classicical machine learning approaches. Accelerating training through Linux commands ran on the HiPerGator supercomputer. Contributing to greater deep learning pipeline for switchgrass root analysis to allow for plant scientists to better understand the effects of root phenotypes on biomass production.",
      icon: <Grass />,
    }
  ];

  const leadershipData = [
    {
      title: "Pre-Professional Director",
      company: "Trailblazers Initiative",
      period: "April 2025 - Present",
      description: "Supporting 33 underrepresented first-year students through the Trailblazers Intitiative of the National Society of Black Engineers. Exposing students to career opportunities, fellowships, internships, and scholarships and helping them navigate the professional development process through resume reviews, mock interviews, and networking events with industry professionals and alumni, resulting in students gaining internship offers at companies such as NextEra Energy and Amazon.",
      icon: <School />,
    },
    {
      title: "General Body Member",
      company: "National Society of Black Engineers",
      period: "August 2024 - Present",
      description: "General body member of NSBE. Have helped conduct and organize various volunteering events and initiatives, such as volunteering at Gainesville's Porter's Quarters community farm, and setting up a food drive with Food4Kids.",
      icon: <Groups />,
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const octokit = new Octokit({
          auth: import.meta.env.VITE_GITHUB_TOKEN
        });
        
        // Fetch pinned repositories using GraphQL
        console.log('Fetching pinned repos for:', githubUsername);
        const response = await octokit.graphql(`
          query {
            user(login: "${githubUsername}") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    id
                    name
                    description
                    url
                    stargazerCount
                    forkCount
                    defaultBranchRef {
                      name
                    }
                  }
                }
              }
            }
          }
        `);

        console.log('GraphQL Response:', response);

        if (!response?.user?.pinnedItems?.nodes) {
          throw new Error('No pinned repositories found');
        }

        const pinnedRepos = response.user.pinnedItems.nodes.map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.url,
          stargazers_count: repo.stargazerCount,
          forks_count: repo.forkCount,
          default_branch: repo.defaultBranchRef?.name || 'main',
        }));

        const projectsWithDetails = await Promise.all(
          pinnedRepos.map(async (project) => {
            try {
              const languagesResponse = await octokit.rest.repos.listLanguages({
                owner: githubUsername,
                repo: project.name,
              });

              let projectImage = null;
              let defaultBranch = project.default_branch;
              
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
                  projectImage = `https://raw.githubusercontent.com/${githubUsername}/${project.name}/${defaultBranch}/${imageFiles[0].name}`;
                }
              } catch (imageError) {
                const branchesToTry = defaultBranch === 'main' ? ['master'] : ['main'];
                
                for (const branch of branchesToTry) {
                  try {
                    const contentsResponse = await octokit.rest.repos.getContent({
                      owner: githubUsername,
                      repo: project.name,
                      path: '',
                      ref: branch
                    });

                    const imageFiles = contentsResponse.data.filter(file => 
                      file.name.toLowerCase().endsWith('.png') && 
                      file.type === 'file'
                    );

                    if (imageFiles.length > 0) {
                      projectImage = `https://raw.githubusercontent.com/${githubUsername}/${project.name}/${branch}/${imageFiles[0].name}`;
                      break;
                    }
                  } catch (branchError) {
                    continue;
                  }
                }
                
                if (!projectImage) {
                  console.log(`No image found for ${project.name} in any branch`);
                }
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
        console.error('Error fetching projects:', err);
        console.error('Error details:', err.message, err.response);
        setError(`Failed to fetch GitHub projects: ${err.message || 'Please check the username and try again.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [githubUsername]);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    if (!isDeleting && displayedText === currentRole) {
      // Pause before deleting
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === '') {
      // Move to next role
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    // Type or delete character
    const timeout = setTimeout(() => {
      setDisplayedText(prev => {
        if (isDeleting) {
          return currentRole.substring(0, prev.length - 1);
        } else {
          return currentRole.substring(0, prev.length + 1);
        }
      });
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRoleIndex, roles]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#FB923C',
      Python: '#F97316',
      TypeScript: '#EA580C',
      Java: '#FDBA74',
      'C++': '#F59E0B',
      React: '#FB923C',
      Vue: '#FCD34D',
      HTML: '#FFA07A',
      CSS: '#FF8C42',
      Go: '#F97316',
      Rust: '#C2410C',
      Swift: '#FDBA74',
      Kotlin: '#EA580C',
      'C#': '#D97706',
      PHP: '#d0871a',
      Ruby: '#F97316',
      Dart: '#FB923C',
      Scala: '#EA580C',
      Shell: '#FDBA74',
      Dockerfile: '#F59E0B'
    };
    return colors[language] || '#F97316';
  };

  const getTopLanguages = (languages) => {
    const entries = Object.entries(languages);
    const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
    
    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, bytes]) => ({
        name,
        percentage: ((bytes / total) * 100).toFixed(1)
      }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ParticleBackground />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Fixed Header Navigation */}
        <Box
          component="nav"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(249, 115, 22, 0.15)',
            zIndex: 1000,
            py: 2,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#2D2D35',
                  cursor: 'pointer',
                  position: 'absolute',
                  left: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F97316',
                    transform: 'scale(1.1)',
                  },
                }}
                onClick={scrollToTop}
              >
                BK
              </Typography>
              <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 } }}>
                <Button
                  onClick={() => scrollToSection('about')}
                  sx={{
                    color: '#2D2D35',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    position: 'relative',
                    '&:hover': {
                      bgcolor: 'rgba(249, 115, 22, 0.08)',
                      color: '#F97316',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: '0%',
                      height: '2px',
                      bgcolor: '#F97316',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  About
                </Button>
                <Button
                  onClick={() => scrollToSection('experience')}
                  sx={{
                    color: '#2D2D35',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    position: 'relative',
                    '&:hover': {
                      bgcolor: 'rgba(249, 115, 22, 0.08)',
                      color: '#F97316',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: '0%',
                      height: '2px',
                      bgcolor: '#F97316',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  Experience
                </Button>
                <Button
                  onClick={() => scrollToSection('projects')}
                  sx={{
                    color: '#2D2D35',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    position: 'relative',
                    '&:hover': {
                      bgcolor: 'rgba(249, 115, 22, 0.08)',
                      color: '#F97316',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: '0%',
                      height: '2px',
                      bgcolor: '#F97316',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  Projects
                </Button>
                <Button
                  onClick={() => scrollToSection('leadership')}
                  sx={{
                    color: '#2D2D35',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    position: 'relative',
                    '&:hover': {
                      bgcolor: 'rgba(249, 115, 22, 0.08)',
                      color: '#F97316',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: '0%',
                      height: '2px',
                      bgcolor: '#F97316',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  Leadership
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Scroll to Top Button */}
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            bgcolor: '#F97316',
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
            opacity: showScrollTop ? 1 : 0,
            visibility: showScrollTop ? 'visible' : 'hidden',
            transition: 'all 0.3s ease',
            zIndex: 999,
            '&:hover': {
              bgcolor: '#FB923C',
              transform: 'translateY(-4px) rotate(5deg)',
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.6)',
            },
          }}
        >
          <Box
            component="svg"
            sx={{ width: 24, height: 24 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </Box>
        </IconButton>

        {/* Hero Section */}
        <Box
          sx={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', py: { xs: 8, md: 0 } }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                mb: 3,
                minHeight: { xs: '120px', sm: '140px', md: '160px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box component="span">
                Bakari Kerr is{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#F97316',
                    position: 'relative',
                    textShadow: '0 0 20px rgba(249, 115, 22, 0.3)',
                    '&::after': {
                      content: '"|"',
                      position: 'absolute',
                      right: '-8px',
                      animation: 'blink 1s step-end infinite',
                    },
                    '@keyframes blink': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0 },
                    },
                  }}
                >
                  {displayedText}
                </Box>
              </Box>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 5, 
                maxWidth: '600px', 
                mx: 'auto',
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Computer Science Student • Machine Learning Researcher • Full-Stack Developer • AI Enthusiast • Future Tech Leader
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: '#F97316',
                  color: 'white',
                  fontWeight: 700,
                  '&:hover': { 
                    bgcolor: '#FB923C',
                    transform: 'scale(1.05) translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={<GitHub />}
              >
                View GitHub
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="https://www.linkedin.com/in/bakari-kerr"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  borderColor: '#F97316',
                  borderWidth: '2px',
                  color: '#F97316',
                  fontWeight: 700,
                  '&:hover': { 
                    borderColor: '#FB923C',
                    borderWidth: '2px',
                    color: '#FB923C',
                    bgcolor: 'rgba(249, 115, 22, 0.08)',
                    transform: 'scale(1.05) translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={<LinkedIn />}
              >
                Connect on LinkedIn
              </Button>
            </Box>
          </Container>
        </Box>

        {/* About Section */}
        <SectionDivider color="#F97316" />
        <Container id="about" maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Typography 
            variant="h2" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            About Me
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              textAlign: 'center',
              bgcolor: 'transparent',
              borderRadius: 0,
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.8, 
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
I am Bakari Kerr, a Computer Science major at the University of Florida with a deep passion for artificial intelligence and machine learning. I am excited about the potential for AI and ML to drive innovation and solve real-world challenges. As an active member of the National Society of Black Engineers (NSBE) and ColorStack, I am proud to be part of communities that emphasize diversity, empowerment, and excellence in tech.
In addition to my academic pursuits, I am always looking for opportunities to grow both as a developer and researcher, particularly in AI/ML, and I am committed to using my skills to make a positive impact. Whether it is through mentorship, collaboration, or involvement in community-driven projects, I am passionate about giving back and supporting others on their tech journey.
I am always eager to connect with like-minded individuals, organizations, and innovators who share a commitment to advancing technology in ways that foster equity and drive meaningful change.
            </Typography>
          </Paper>
        </Container>

        {/* Experience Section */}
        <SectionDivider color="#F97316" />
        <Box id="experience" sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="xl">
            <Typography 
              variant="h2" 
              component="h2" 
              textAlign="center" 
              gutterBottom
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
            >
              Experience
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 3,
            }}>
              {experienceData.map((exp, index) => (
                <Card key={index} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: '#F97316',
                            background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                            mr: 2,
                            width: 48,
                            height: 48,
                            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                          }}
                        >
                          {exp.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="h3" sx={{ mb: 0.5 }}>
                            {exp.title}
                          </Typography>
                          <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500 }}>
                            {exp.company}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={exp.period}
                        size="small"
                        sx={{ 
                          mb: 2,
                          bgcolor: 'rgba(249, 115, 22, 0.08)',
                          color: 'text.secondary',
                          border: 'none',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {exp.description}
                      </Typography>
                    </CardContent>
                  </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Projects Section */}
        <SectionDivider color="#FB923C" />
        <Container id="projects" maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Typography 
            variant="h2" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Featured Projects
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={48} sx={{ color: '#F97316' }} />
            </Box>
          )}
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'error.light',
              }}
            >
              {error}
            </Alert>
          )}
          
          {!loading && !error && (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 3,
            }}>
              {projects.map((project) => {
                const topLanguages = getTopLanguages(project.languages);
                
                return (
                    <Card key={project.id} sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                    }}>
                      {project.projectImage && (
                        <CardMedia
                          component="img"
                          image={project.projectImage}
                          alt={`${project.name} preview`}
                          sx={{
                            objectFit: 'cover',
                            bgcolor: '#F5F5F7',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                        <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 1.5 }}>
                          {project.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            mb: 2.5, 
                            lineHeight: 1.6,
                            flexGrow: 1,
                          }}
                        >
                          {project.description || 'No description available'}
                        </Typography>
                        
                        {topLanguages.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {topLanguages.map((lang) => (
                                <Chip
                                  key={lang.name}
                                  size="small"
                                  label={lang.name}
                                  sx={{
                                    bgcolor: getLanguageColor(lang.name),
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    border: 'none',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                      transform: 'scale(1.1)',
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <Star fontSize="small" sx={{ fontSize: 18 }} />
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                              {project.stargazers_count}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <CallSplit fontSize="small" sx={{ fontSize: 18 }} />
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                              {project.forks_count}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          size="medium"
                          sx={{ 
                            color: '#F97316',
                            fontWeight: 700,
                            position: 'relative',
                            '&:hover': { 
                              bgcolor: 'rgba(249, 115, 22, 0.08)',
                              color: '#FB923C',
                              transform: 'translateX(4px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                          startIcon={<Launch />}
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Project
                        </Button>
                      </CardActions>
                    </Card>
                );
              })}
            </Box>
          )}
        </Container>

        {/* Leadership & Involvement Section */}
        <SectionDivider color="#F97316" />
        <Box id="leadership" sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="xl">
            <Typography 
              variant="h2" 
              component="h2" 
              textAlign="center" 
              gutterBottom
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
            >
              Leadership & Involvement
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 3,
            }}>
              {leadershipData.map((item, index) => (
                  <Card key={index} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: '#F97316',
                            background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                            mr: 2,
                            width: 48,
                            height: 48,
                            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                          }}
                        >
                          {item.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="h3" sx={{ mb: 0.5 }}>
                            {item.title}
                          </Typography>
                          <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500 }}>
                            {item.company}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={item.period}
                        size="small"
                        sx={{ 
                          mb: 2,
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                          color: 'text.secondary',
                          border: 'none',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Contact Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: '#2D2D35',
            background: 'linear-gradient(135deg, #2D2D35 0%, #3F3F4A 100%)',
            color: 'white',
            py: { xs: 6, md: 8 },
            textAlign: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #F97316 0%, #FB923C 50%, #F97316 100%)',
            },
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h4" 
              component="h3" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.75rem', md: '2.125rem' },
                fontWeight: 600,
                mb: 2,
              }}
            >
              Let's Connect
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: '500px',
                mx: 'auto',
              }}
            >
              Feel free to connect with me on LinkedIn or check out my projects on GitHub!
            </Typography>
            
            {/* Footer Navigation Links */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <Button
                onClick={() => scrollToSection('about')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  position: 'relative',
                  '&:hover': {
                    color: '#FB923C',
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: '0%',
                    height: '2px',
                    bgcolor: '#FB923C',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '80%',
                  },
                }}
              >
                About
              </Button>
              <Button
                onClick={() => scrollToSection('experience')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  position: 'relative',
                  '&:hover': {
                    color: '#FB923C',
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: '0%',
                    height: '2px',
                    bgcolor: '#FB923C',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '80%',
                  },
                }}
              >
                Experience
              </Button>
              <Button
                onClick={() => scrollToSection('projects')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  position: 'relative',
                  '&:hover': {
                    color: '#FB923C',
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: '0%',
                    height: '2px',
                    bgcolor: '#FB923C',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '80%',
                  },
                }}
              >
                Projects
              </Button>
              <Button
                onClick={() => scrollToSection('leadership')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  position: 'relative',
                  '&:hover': {
                    color: '#FB923C',
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: '0%',
                    height: '2px',
                    bgcolor: '#FB923C',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '80%',
                  },
                }}
              >
                Leadership
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 5 }}>
              <IconButton
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                size="large"
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(249, 115, 22, 0.2)',
                  '&:hover': { 
                    bgcolor: '#F97316',
                    transform: 'scale(1.15) rotate(5deg)',
                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.5)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <GitHub />
              </IconButton>
              <IconButton
                href="https://linkedin.com/in/bakari-kerr"
                target="_blank"
                rel="noopener noreferrer"
                size="large"
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(249, 115, 22, 0.2)',
                  '&:hover': { 
                    bgcolor: '#F97316',
                    transform: 'scale(1.15) rotate(-5deg)',
                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.5)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2025 Bakari Kerr
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;