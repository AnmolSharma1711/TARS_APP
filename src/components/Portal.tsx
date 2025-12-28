import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { User } from '../services/authService';
import { api, type ClassData, type ResourceData } from '../services/api';
import { ShootingStars } from './ui/shooting-stars';
import { StarsBackground } from './ui/stars-background';
import { FocusCards } from './ui/focus-cards';
import './Portal.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const resolveMediaUrl = (value?: string) => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_BASE_URL}${value}`;
};

function Portal() {
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
    loadPortalData();
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Timeout: forcing loading to false');
      setLoading(false);
    }, 10000); // 10 seconds
    
    return () => clearTimeout(timeout);
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      handleLogout();
    }
  };

  const loadPortalData = async () => {
    try {
      const token = await authService.getAccessToken();
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }
      
      console.log('Fetching portal data with token...');
      const data = await api.getMemberPortalData(token);
      console.log('Portal data received:', data);
      setClasses(data.classes);
      setResources(data.resources);
    } catch (error) {
      console.error('Failed to load portal data:', error);
      // Set empty data on error so page still loads
      setClasses([]);
      setResources([]);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming': return 'badge-upcoming';
      case 'ongoing': return 'badge-ongoing';
      case 'completed': return 'badge-completed';
      default: return 'badge-default';
    }
  };

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'badge-beginner';
      case 'intermediate': return 'badge-intermediate';
      case 'advanced': return 'badge-advanced';
      default: return 'badge-default';
    }
  };

  const getModeBadgeClass = (mode: string) => {
    switch (mode) {
      case 'online': return 'badge-online';
      case 'offline': return 'badge-offline';
      case 'hybrid': return 'badge-hybrid';
      default: return 'badge-default';
    }
  };

  const handleDownload = async (resourceId: number, downloadUrl: string) => {
    try {
      console.log('Download clicked for resource:', resourceId);
      const token = await authService.getAccessToken();
      if (token) {
        console.log('Incrementing download count...');
        // Increment download count
        const result = await api.incrementDownload(resourceId, token);
        console.log('Download count incremented:', result);
        
        // Update local state
        setResources(prevResources => 
          prevResources.map(r => 
            r.id === resourceId 
              ? { ...r, download_count: r.download_count + 1 }
              : r
          )
        );
      } else {
        console.error('No token found');
      }
      
      // Open download link
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to track download:', error);
      // Still open the download even if tracking fails
      window.open(downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="portal-container" style={{ 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <ShootingStars />
      <StarsBackground />
      <nav className="portal-navbar">
        <div className="navbar-brand">
          <h1>TARS Member Portal</h1>
        </div>
        <div className="navbar-user">
          <span className="user-name">
            Welcome, {user?.first_name || user?.username}!
          </span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="portal-content">
        {/* Classes Section */}
        <section className="portal-section">
          <div className="section-header">
            <h2>📚 Available Classes</h2>
          </div>

          {classes.length === 0 ? (
            <div className="empty-state">
              <p>No classes available at the moment.</p>
              <p className="text-muted">Check back later for new workshops and training sessions!</p>
            </div>
          ) : (
            <FocusCards cards={classes
              .filter((classItem) => {
                // Show all classes except those completed more than 12 hours ago
                if (classItem.status_display === 'Completed' && classItem.end_date) {
                  const endDate = new Date(classItem.end_date);
                  const now = new Date();
                  const hoursDiff = (now.getTime() - endDate.getTime()) / (1000 * 60 * 60);
                  return hoursDiff < 12;
                }
                return true;
              })
              .map((classItem) => ({
              title: classItem.title,
              src: resolveMediaUrl(classItem.thumbnail) || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
              description: classItem.description,
              badges: (
                <>
                  <span className={`badge ${getStatusBadgeClass(classItem.status)}`}>
                    {classItem.status_display}
                  </span>
                  <span className={`badge ${getDifficultyBadgeClass(classItem.difficulty)}`}>
                    {classItem.difficulty_display}
                  </span>
                  <span className={`badge ${getModeBadgeClass(classItem.mode)}`}>
                    {classItem.mode_display}
                  </span>
                </>
              ),
              meta: (
                <>
                  <div className="meta-item">
                    <span className="meta-icon">👨‍🏫</span>
                    <span>{classItem.instructor}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>{classItem.start_date_formatted}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span>{classItem.duration}</span>
                  </div>
                  {(classItem.mode === 'offline' || classItem.mode === 'hybrid') && classItem.location && (
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{classItem.location}</span>
                    </div>
                  )}
                </>
              ),
              actions: (
                <>
                  {classItem.meeting_link && classItem.is_joinable ? (
                    <a 
                      href={classItem.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Join Class
                    </a>
                  ) : classItem.meeting_link ? (
                    <button 
                      disabled
                      className="btn btn-primary"
                      title={classItem.status_display === 'Upcoming' ? 'Class has not started yet' : 'Class has ended'}
                    >
                      Join Class
                    </button>
                  ) : null}
                  {classItem.syllabus && (
                    <a 
                      href={resolveMediaUrl(classItem.syllabus)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      View Syllabus
                    </a>
                  )}
                </>
              )
            }))} />
          )}
        </section>

        {/* Resources Section */}
        <section className="portal-section">
          <div className="section-header">
            <h2>📖 Learning Resources</h2>
          </div>

          {resources.length === 0 ? (
            <div className="empty-state">
              <p>No resources available at the moment.</p>
              <p className="text-muted">Check back later for tutorials, documentation, and learning materials!</p>
            </div>
          ) : (
            <FocusCards cards={resources.map((resource) => ({
              title: resource.title,
              src: resolveMediaUrl(resource.thumbnail) || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
              description: resource.description,
              badges: (
                <>
                  <span className="badge badge-category">{resource.category_display}</span>
                  {resource.is_featured && (
                    <span className="badge badge-featured">⭐ Featured</span>
                  )}
                </>
              ),
              meta: resource.author ? (
                <div className="meta-item">
                  <span className="meta-icon">✍️</span>
                  <span>{resource.author}</span>
                </div>
              ) : undefined,
              tags: resource.tag_list,
              actions: (
                <>
                  {resource.external_link && (
                    <button
                      onClick={() => handleDownload(resource.id, resource.external_link || '')}
                      className="btn btn-primary"
                    >
                      Visit Resource
                    </button>
                  )}
                  {resource.file && (
                    <button
                      onClick={() => handleDownload(resource.id, resolveMediaUrl(resource.file) || '')}
                      className="btn btn-secondary"
                    >
                      Download
                    </button>
                  )}
                </>
              )
            }))} />
          )}
        </section>
      </main>
    </div>
  );
}

export default Portal;
