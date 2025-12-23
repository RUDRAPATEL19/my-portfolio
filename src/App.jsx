import React, { useEffect, useState } from 'react';
import { projects, skills } from './data';
import emailjs from '@emailjs/browser';


const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const PROJECT_CATEGORIES = ['All', 'Web App', 'Data Viz', 'Game Dev'];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Dark mode preference
  useEffect(() => {
    const stored = window.localStorage.getItem('portfolio-theme');
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('portfolio-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Smooth active section indicator
  useEffect(() => {
    const sections = document.querySelectorAll('section[data-section]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6,            // section must be 60% on screen to activate
        rootMargin: "0px 0px -20% 0px"  // prevents the next section from triggering early
      }
    );

    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Scroll reveal animations
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Custom cursor effect
  useEffect(() => {
    const handleMove = e => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter(p => p.category === selectedCategory);

  const handleNavClick = id => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-root">
      {/* Custom cursor */}
      <div
      className="cursor-dot"
      style={{
        left: `${cursorPos.x}px`,
        top: `${cursorPos.y}px`,
      }}
    />


      {/* Background gradient & blobs */}
      <div className="bg-gradient" />
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />

      <header className="navbar glass">
        <div className="nav-left">
          <span className="logo">RP</span>
          <span className="logo-text">Portfolio</span>
        </div>
        <nav className="nav-links">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={
                'nav-link ' + (activeSection === item.id ? 'nav-link-active' : '')
              }
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="nav-right">
          <button
            className="theme-toggle"
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main>
        <Hero />
        <About />
        <Projects
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredProjects={filteredProjects}
          onProjectClick={setSelectedProject}
        />
        <Skills />
        <Contact />
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Rudra Patel. All rights reserved.</span>
      </footer>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}

/* ---------------- SECTIONS ---------------- */

function Hero() {
  return (
    <section id="hero" data-section className="section hero-section reveal-on-scroll">
      <div className="hero-content glass">
        <p className="hero-pill">Available for New Grad & Junior Roles</p>
        <h1 className="hero-title">
          Hi, I&apos;m <span className="accent">Rudra Patel</span>.
          <br />
          <span className="gradient-text">Full-Stack Developer</span>
        </h1>
        <p className="hero-subtitle">
          I build modern, performant web applications with delightful user experiences.
        </p>
        <div className="hero-actions">
          <button
            className="btn primary"
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            View Projects
          </button>
          <button
            className="btn ghost"
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Contact Me
          </button>
        </div>
        <div className="hero-meta">
          <div>
            <span className="meta-label">Focus</span>
            <span className="meta-value">Full-Stack / Web Apps</span>
          </div>
          <div>
            <span className="meta-label">Location</span>
            <span className="meta-value">Moncton, Canada</span>
          </div>
          <div>
            <span className="meta-label">Open to</span>
            <span className="meta-value">Remote & On-site</span>
          </div>
        </div>
      </div>

      {/* Floating elements / parallax-ish */}
      <div className="hero-floating hero-floating-1" />
      <div className="hero-floating hero-floating-2" />
      <div className="hero-floating hero-floating-3" />
    </section>
  );
}

function About() {
  return (
    <section id="about" data-section className="section reveal-on-scroll">
      <div className="section-header">
        <h2>About Me</h2>
        <p>Who I am and what I love building.</p>
      </div>
      <div className="about-grid">
        <div className="glass about-text">
          <p>
            I&apos;m a passionate developer who enjoys turning ideas into real-world
            applications. I focus on writing clean, maintainable code and crafting
            intuitive user experiences.
          </p>
          <p>
            From full-stack web apps to interactive dashboards and small games, I love
            learning new technologies and collaborating with others to ship products that
            people actually use.
          </p>
        </div>
        <div className="glass about-skills-visual">
          <h3>Core Strengths</h3>
          <SkillBar label="Frontend UI/UX" value={85} />
          <SkillBar label="Backend APIs" value={80} />
          <SkillBar label="Databases" value={75} />
          <SkillBar label="Problem Solving" value={90} />
          <SkillTagCloud />
        </div>
      </div>
    </section>
  );
}

function Projects({ selectedCategory, setSelectedCategory, filteredProjects, onProjectClick }) {
  return (
    <section id="projects" data-section className="section reveal-on-scroll">
      <div className="section-header">
        <h2>Projects</h2>
        <p>A snapshot of what I&apos;ve been building recently.</p>
      </div>

      <div className="filter-bar">
        {PROJECT_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={
              'filter-pill ' + (selectedCategory === cat ? 'filter-pill-active' : '')
            }
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <article
            key={project.id}
            className="glass project-card"
            onClick={() => onProjectClick(project)}
          >
            <div className="project-thumb-wrapper">
              <img src={project.thumbnail} alt={project.title} className="project-thumb" />
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-category">{project.category}</p>
              <p className="project-short">{project.shortDescription}</p>
              <div className="project-tech">
                {project.tech.map(t => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
              <button className="project-more">View details</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" data-section className="section reveal-on-scroll">
      <div className="section-header">
        <h2>Skills</h2>
        <p>Technologies and tools I work with.</p>
      </div>
      <div className="skills-grid">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="glass skill-card">
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div className="skill-tags">
              {items.map(skill => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    setLoading(true);

    const form = e.currentTarget;

    const data = {
      from_name: form.name.value,
      from_email: form.email.value,
      message: form.message.value,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        data,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus({ type: 'success', msg: 'Message sent! I will reply soon.' });
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        msg: 'Failed to send. Please try again or email me directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-section className="section reveal-on-scroll">
      <div className="section-header">
        <h2>Contact</h2>
        <p>Let&apos;s build something great together.</p>
      </div>

      <div className="contact-grid">
        <form className="glass contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" placeholder="Your name" required />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Tell me a bit about your project or opportunity..."
              required
            />
          </div>

          <button type="submit" className="btn primary full-width" disabled={loading}>
            {loading ? 'Sending…' : 'Send Message'}
          </button>

          {status.msg && (
            <p style={{ marginTop: '0.8rem', color: status.type === 'error' ? '#fca5a5' : '#86efac' }}>
              {status.msg}
            </p>
          )}
        </form>

        <div className="glass contact-info">
          <h3>Let&apos;s connect</h3>
          <p>Feel free to reach out for collaborations, opportunities, or just to say hi.</p>
          <ul className="contact-list">
            <li>
              <span className="contact-label">Email</span>
              <a href="mailto:rudrampatel1510@gmail.com">rudrampatel1510@gmail.com</a>
            </li>
            <li>
              <span className="contact-label">LinkedIn</span>
              <a href="https://www.linkedin.com/in/rudra19/" target="_blank" rel="noreferrer">
                linkedin.com/in/rudra19/
              </a>
            </li>
            <li>
              <span className="contact-label">GitHub</span>
              <a href="https://github.com/RUDRAPATEL19" target="_blank" rel="noreferrer">
                github.com/RUDRAPATEL19
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}


/* ---------------- SMALL COMPONENTS ---------------- */

function SkillBar({ label, value }) {
  return (
    <div className="skillbar">
      <div className="skillbar-header">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="skillbar-track">
        <div
          className="skillbar-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SkillTagCloud() {
  const tags = [
    'Problem Solving',
    'Clean Code',
    'Teamwork',
    'UI/UX',
    'Testing',
    'APIs',
    'Agile',
    'Performance',
  ];
  return (
    <div className="tag-cloud">
      {tags.map(tag => (
        <span key={tag} className="chip chip-soft">
          {tag}
        </span>
      ))}
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal glass"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <img src={project.thumbnail} alt={project.title} className="modal-thumb" />
        <h2>{project.title}</h2>
        <p className="project-category">{project.category}</p>
        <p className="modal-description">{project.description}</p>
        <div className="project-tech">
          {project.tech.map(t => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="modal-links">
          {project.link !== '#' && (
            <a href={project.link} target="_blank" rel="noreferrer" className="btn primary">
              Live Demo
            </a>
          )}
          {project.github !== '#' && (
            <a href={project.github} target="_blank" rel="noreferrer" className="btn ghost">
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
