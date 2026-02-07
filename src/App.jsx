import React, { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

// ⚠️ PASTE YOUR SUPABASE KEYS HERE
const supabaseUrl = 'url';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpY2Ruc2piamdndXZxbWtsZG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDU4MDQsImV4cCI6MjA4NjAyMTgwNH0.to-UhSotsQQMPDte9r6broE1SRVX1zfm7C1CvV-v6HE';
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'General',
    author_name: 'Alex Rivera'
  });

  // 1. Fetch Data & Subscribe to Real-time Updates
  useEffect(() => {
    fetchNotices();

    // Real-time subscription: Updates automatically when DB changes
    const subscription = supabase
      .channel('public:notices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, (payload) => {
        console.log('Change received!', payload);
        fetchNotices(); // Refresh data on any change
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNotices(data);
      if (data.length > 0 && !selectedNotice) setSelectedNotice(data[0]);
    } catch (error) {
      console.error('Error fetching notices:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    const { error } = await supabase
      .from('notices')
      .insert([{ 
        title: newNotice.title, 
        content: newNotice.content, 
        category: newNotice.category,
        is_urgent: newNotice.category === 'Urgent',
        created_at: new Date()
      }]);

    if (!error) {
      setIsModalOpen(false);
      setNewNotice({ title: '', content: '', category: 'General', author_name: 'Alex Rivera' });
      // Fetch will happen automatically via subscription, but we can force it too
      fetchNotices();
    } else {
      alert(error.message);
    }
  };

  const filteredNotices = notices.filter(n => 
    (filter === 'All' || n.category === filter) &&
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-box">
            <span className="material-symbols-outlined">campaign</span>
          </div>
          <h1 className="brand-title">Community Board</h1>
          <div className="search-bar">
            <span className="material-symbols-outlined icon">search</span>
            <input 
              type="text" 
              placeholder="Search notices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="material-symbols-outlined">add_circle</span>
            Create Notice
          </button>
          <div className="user-profile">
            <div className="user-info">
              <p className="user-name">Alex Rivera</p>
              <p className="user-role">Admin Staff</p>
            </div>
            <div className="avatar">A</div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="main-layout">
        {/* Sidebar List */}
        <aside className="sidebar">
          <div className="filter-tabs">
            {['All', 'Academic', 'Events', 'Urgent', 'General'].map(cat => (
              <button 
                key={cat}
                className={`tab-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="notice-list">
            {loading ? <p className="loading-text">Loading updates...</p> : filteredNotices.map(notice => (
              <div 
                key={notice.id} 
                className={`notice-card ${selectedNotice?.id === notice.id ? 'selected' : ''} ${notice.is_urgent ? 'urgent-card' : ''}`}
                onClick={() => setSelectedNotice(notice)}
              >
                <div className="card-meta">
                  <span className={`badge ${notice.category.toLowerCase()}`}>{notice.category}</span>
                  <span className="timestamp">{new Date(notice.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="card-title">{notice.title}</h3>
                <p className="card-excerpt">{notice.content.substring(0, 60)}...</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Detail View */}
        <section className="detail-view">
          {selectedNotice ? (
            <div className="detail-card fade-in">
              <div className="featured-image"></div>
              <div className="detail-content">
                <div className="detail-header">
                  <span className={`badge lg ${selectedNotice.category.toLowerCase()}`}>{selectedNotice.category}</span>
                  <span className="publish-date">Posted on {new Date(selectedNotice.created_at).toLocaleString()}</span>
                </div>
                <h2 className="detail-title">{selectedNotice.title}</h2>
                <div className="author-bar">
                  <div className="author-icon"><span className="material-symbols-outlined">school</span></div>
                  <div>
                    <p className="author-name">{selectedNotice.author_name || 'Admin'}</p>
                    <p className="author-subtext">Official Announcement</p>
                  </div>
                </div>
                <div className="prose">
                  <p>{selectedNotice.content}</p>
                </div>
                <div className="action-footer">
                  <button className="btn-register">Register / Action</button>
                  <button className="btn-outline">View Guidelines</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select a notice to view details</div>
          )}
        </section>
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>New Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={newNotice.title} 
                  onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                  placeholder="Enter notice title"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newNotice.category}
                  onChange={e => setNewNotice({...newNotice, category: e.target.value})}
                >
                  <option>General</option>
                  <option>Academic</option>
                  <option>Events</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea 
                  rows="4" 
                  value={newNotice.content} 
                  onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                  placeholder="Type the announcement details..."
                ></textarea>
              </div>
              <button type="submit" className="btn-submit">Post Announcement</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
