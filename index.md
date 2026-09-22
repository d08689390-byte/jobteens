---
layout: default
title: JobTeens
---

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

<div id="site-content">
# JobTeens

Welcome to JobTeens — a UK-focused job board for ages 13–17 (and up to 25 for neurodivergent applicants).

## Account Login

<div id="recaptcha-container"></div>

<button id="login-email">Login with Email</button>
<button id="register-email">Register with Email</button>
<button id="login-phone">Login with Phone</button>
<button id="login-google">Login with Google</button>
<button id="login-github">Login with GitHub</button>

## Filter Jobs

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

## Job Listings

<div id="jobs-list"></div>

More features will be added as development continues.
</div>
