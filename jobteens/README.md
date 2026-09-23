# JobTeens

JobTeens is a teen-friendly job board built with GitHub Pages and Jekyll.  
It helps young people aged 13–17 (and up to 25 for neurodivergent applicants) find local or remote part-time work that matches their age, location, and legal working limits.

---

## Overview

JobTeens is designed to be a safe, accessible, legally-compliant platform for UK teens seeking part-time work.  
It filters jobs by:

- Age category (13–15, 16–17, 18–25 ND)
- Location (postcode, city, radius)
- Job type (light work, remote, weekend, etc.)
- Legal restrictions (school-age worker rules, council permits, young worker protections)

The site is fully static, using Jekyll collections, a JSON endpoint, and client-side JavaScript filtering.

---

## Features

- Age-filtered job listings  
- Location-based search  
- Remote job support  
- Legal compliance for UK youth employment  
- Optional neurodivergent support (up to age 25)  
- Fast static architecture (GitHub Pages)  
- Jekyll collections for structured job data  
- JSON endpoint for dynamic filtering  
- Clean, responsive UI  

---

## Tech Stack

| Component | Description |
|-----------|-------------|
| Jekyll | Static site generator powering JobTeens |
| GitHub Pages | Hosting and automatic builds |
| Liquid | Templates and JSON generation |
| JavaScript | Client-side filtering logic |
| SCSS | Clean, modular styling |
| Postcodes.io / Maps API | Optional location lookup |

---

## Project Structure

    jobteens/
    │
    ├── _config.yml
    ├── index.md
    │
    ├── _layouts/
    │   └── default.html
    │
    ├── _jobs/              # Jekyll job collection
    │   ├── job1.md
    │   ├── job2.md
    │   └── job3.md
    │
    ├── jobs.json
    │
    └── assets/
        ├── css/
        └── js/

---

## How It Works

### 1. Jobs stored as Markdown

Each job is a Markdown file in `_jobs/` with YAML front matter. Example metadata (shown as plain text):

    ---
    title: "Retail Assistant - Glenfield"
    company: "FreshMart"
    location: "Glenfield, Leicester"
    min_age: 13
    max_age: 15
    type: "light-work"
    permit_required: true
    ---

### 2. Jekyll converts them into JSON

A Liquid template generates `jobs.json` from the `_jobs` collection so the frontend can fetch all listings.

### 3. JavaScript filters by age and location

Client-side code fetches `jobs.json` and filters results by the user's selected age and location, showing permit banners or warnings where required.

---

## Roadmap

- [ ] Age verification UI  
- [ ] Location selector (postcode to area)  
- [ ] Council permit banners for 13–15  
- [ ] Employer dashboard  
- [ ] Accessibility mode for neurodivergent applicants  
- [ ] Dark turquoise cyber theme  

---

## Contributing

Contributions are welcome, especially around accessibility, legal compliance, and UI improvements. Please open issues or pull requests with clear descriptions and tests where applicable.

---

## Contact

Created by Denis Kuizinas  
GitHub: https://github.com/d08689390-byte
