---
layout: default
title: JobTeens
---

<!-- Startup screen -->
<div id="startup-screen">
  <audio id="gba-sound" src="/assets/audio/gba-startup.mp3"></audio>
  <img id="jobteens-logo" src="/assets/img/jobteens-logo.svg" alt="JobTeens Logo">
</div>

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


