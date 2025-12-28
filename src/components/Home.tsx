import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { ShootingStars } from './ui/shooting-stars'
import { StarsBackground } from './ui/stars-background'
import './Home.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const resolveMediaUrl = (value?: string) => {
  if (!value) return undefined
  if (/^https?:\/\//i.test(value)) return value
  return `${API_BASE_URL}${value}`
}

interface SiteSettings {
  id: number
  club_name: string
  club_full_name: string
  club_motto: string
  club_logo?: string
  university_logo?: string
  hero_background?: string
}

interface Sponsor {
  id: number
  name: string
  logo: string
  website?: string
  collaboration_agenda: string
  collaboration_date: string
  collaboration_date_formatted: string
  order: number
}

interface SocialLink {
  id: number
  platform: string
  platform_display: string
  url: string
  icon_class?: string
  order: number
}

interface HomePageData {
  site_settings: SiteSettings | null
  sponsors: Sponsor[]
  social_links: SocialLink[]
}

const Home = () => {
  const navigate = useNavigate()
  const [homeData, setHomeData] = useState<HomePageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const data = await api.getHomePageData()
      setHomeData(data)
    } catch (error) {
      console.error('Failed to load home page data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  const settings = homeData?.site_settings

  return (
    <div className="home-container">
      <ShootingStars />
      <StarsBackground />
      
      {settings?.university_logo && (
        <div className="university-logo-wrapper">
          <img 
            src={resolveMediaUrl(settings.university_logo)}
            alt="University Logo"
            className="university-logo"
          />
        </div>
      )}

      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{
          backgroundImage: settings?.hero_background 
            ? `linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%), url(${resolveMediaUrl(settings.hero_background)})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-content">
          {settings?.club_logo && (
            <div className="hero-logo">
              <img 
                src={resolveMediaUrl(settings.club_logo)}
                alt={settings.club_name}
                className="club-logo-img"
              />
            </div>
          )}
          <h1 className="hero-title">{settings?.club_name || 'TARS'}</h1>
          <h2 className="hero-subtitle">
            {settings?.club_full_name || 'Technology and Automation Research Society'}
          </h2>
          <p className="hero-motto">
            {settings?.club_motto || 
              'Pioneering the future of intelligent systems and automated solutions. Innovating at the intersection of technology, research, and human advancement.'}
          </p>
          <div className="hero-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Member Login
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.scrollTo({ top: document.querySelector('.sponsors-section')?.getBoundingClientRect().top, behavior: 'smooth' })}
            >
              Our Partners
            </button>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      {homeData?.sponsors && homeData.sponsors.length > 0 && (
        <section className="sponsors-section">
          <div className="sponsors-container">
            <h2 className="section-title">Our Partners & Sponsors</h2>
            <p className="section-subtitle">Collaborating with industry leaders</p>
            
            <div className="sponsors-scroll-wrapper">
              <div className="sponsors-scroll">
                {/* Duplicate sponsors only if we have less than 5 for infinite scroll effect */}
                {(homeData.sponsors.length < 5 
                  ? [...homeData.sponsors, ...homeData.sponsors, ...homeData.sponsors]
                  : homeData.sponsors
                ).map((sponsor, index) => (
                  <div key={`${sponsor.id}-${index}`} className="sponsor-card">
                    <div className="sponsor-logo-wrapper">
                      {sponsor.logo ? (
                          <img 
                            src={resolveMediaUrl(sponsor.logo)}
                            alt={sponsor.name}
                            className="sponsor-logo"
                          />
                      ) : (
                        <div className="sponsor-placeholder">{sponsor.name[0]}</div>
                      )}
                    </div>
                    <div className="sponsor-info">
                      <h3 className="sponsor-name">{sponsor.name}</h3>
                      <p className="sponsor-agenda">{sponsor.collaboration_agenda}</p>
                      <p className="sponsor-date">
                        <span className="date-label">Since:</span> {sponsor.collaboration_date_formatted}
                      </p>
                      {sponsor.website && (
                        <a 
                          href={sponsor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="sponsor-link"
                        >
                          Visit Website →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
              {settings?.club_logo && (
                <img 
                  src={resolveMediaUrl(settings.club_logo)}
                  alt={settings.club_name}
                  className="footer-logo"
                />
              )}
            <h3>{settings?.club_name || 'TARS'}</h3>
            <p>{settings?.club_full_name || 'Technology and Automation Research Society'}</p>
          </div>
          
          {homeData?.social_links && homeData.social_links.length > 0 && (
            <div className="footer-section">
              <h4>Connect With Us</h4>
              <div className="social-links">
                {homeData.social_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    title={link.platform_display}
                  >
                    {link.platform === 'facebook' && '📘'}
                    {link.platform === 'twitter' && '🐦'}
                    {link.platform === 'instagram' && '📷'}
                    {link.platform === 'linkedin' && '💼'}
                    {link.platform === 'github' && '💻'}
                    {link.platform === 'youtube' && '📺'}
                    {link.platform === 'discord' && '💬'}
                    {link.platform === 'email' && '📧'}
                    {link.platform === 'website' && '🌐'}
                    {link.platform === 'other' && '🔗'}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <div className="footer-section">
            <p className="footer-copyright">
              © {new Date().getFullYear()} {settings?.club_name || 'TARS'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
