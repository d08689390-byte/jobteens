---
layout: default
title: JobTeens
---

<style>
  .header-nav-container { display: flex; justify-content: flex-end; padding: 10px; background: #f8f9fa; border-bottom: 1px solid #e5e7eb; position: relative; }
  .profile-link-btn { display: flex; align-items: center; gap: 8px; text-decoration: none; color: #333; font-weight: 600; cursor: pointer; border: 1px solid #ccc; padding: 6px 12px; border-radius: 20px; background: white; }
  .profile-icon { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; }
  .nav-dropdown-menu { display: none; position: absolute; top: 100%; right: 10px; background: white; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 180px; z-index: 100; margin-top: 5px; }
  .nav-dropdown-menu a { display: block; padding: 10px 15px; text-decoration: none; color: #333; border-bottom: 1px solid #eee; }
  .nav-dropdown-menu a:last-child { border-bottom: none; }
  .nav-dropdown-menu a:hover { background: #f3f4f6; }
</style>

<!-- FULLSCREEN INTRO -->
<div id="intro-screen">
  <div id="white-flash"></div>
  <audio id="gba-sound" src="{{ '/assets/audio/gba-startup.mp3' | relative_url }}"></audio>
  <div id="letters-container">
    <span class="intro-letter" id="l-J">J</span>
    <span class="intro-letter" id="l-O">O</span>
    <span class="intro-letter" id="l-B">B</span>
    <span class="intro-letter" id="l-T">T</span>
    <span class="intro-letter" id="l-E1">E</span>
    <span class="intro-letter" id="l-E2">E</span>
    <span class="intro-letter" id="l-N">N</span>
    <span class="intro-letter" id="l-S">S</span>
  </div>
  <div id="intro-tagline">Youth-powered jobs for The Youth</div>
</div>

<!-- TOP GLOBAL NAVIGATION SYSTEM -->
<div class="header-nav-container">
  <div style="position: relative;">
    <button type="button" class="profile-link-btn" id="dynamic-user-nav" onclick="handleNavClick()">
      <svg class="profile-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 21c.7-4 3.4-6 8-6s7.3 2 8 6"></path>
      </svg>
      <span id="nav-button-text">Login/Sign Up</span>
    </button>
    
    <!-- Account Actions Dropdown -->
    <div class="nav-dropdown-menu" id="account-dropdown">
      <a href="{{ '/account.html' | relative_url }}">⚙️ Settings</a>
      <a href="{{ '/account.html' | relative_url }}">👤 Profile</a>
      <a href="{{ '/account.html' | relative_url }}">📁 Documents</a>
      <a href="{{ '/messages.html' | relative_url }}">✉️ Messages</a>
      <a href="#" onclick="localStorage.setItem('loggedIn', 'false'); window.location.reload();" style="color: red;">🚪 Log Out</a>
    </div>
  </div>
</div>

<div id="site-content">
  <h1>JobTeens</h1>
  <p>Welcome to JobTeens — a UK-focused job board for ages 13–17 (and up to 25 for neurodivergent applicants).</p>

  <h2>Filter Jobs</h2>
  <div id="filter-box">
    <label for="filter-age">Age:</label>
    <select id="filter-age">
      <option value="">Select age</option>
      <option value="13">13</option>
      <option value="14">14</option>
      <option value="15">15</option>
      <option value="16">16</option>
      <option value="17">17</option>
    </select>

    <label for="filter-location">Location:</label>
    <input id="filter-location" type="text" placeholder="Enter postcode or area">
    <button id="apply-filter">Apply Filter</button>
  </div>

  <h2>Job Listings</h2>
  <div id="jobs-list"></div>

  More features will be added as development continues.
</div>

<script>
  // Simple check logic simulating session parameters
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  document.addEventListener('DOMContentLoaded', () => {
    const navText = document.getElementById('nav-button-text');
    if (isLoggedIn) {
      navText.innerText = "My Account";
    } else {
      navText.innerText = "Login/Sign Up";
    }
  });

  function handleNavClick() {
    if (!isLoggedIn) {
      // Redirect to login page instantly if user is logged out
      window.location.href = "{{ '/login.html' | relative_url }}";
    } else {
      // Toggle custom settings/profile dropdown block if logged in
      const dropdown = document.getElementById('account-dropdown');
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
  }

  // Close dropdown on click outside
  window.addEventListener('click', function(e) {
    if (!document.getElementById('dynamic-user-nav').contains(e.target)) {
      document.getElementById('account-dropdown').style.display = 'none';
    }
  });
</script>
