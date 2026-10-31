// Inside main.js - replace your loadJobs function with this:
async function loadJobs() {
  try {
    // Stop fetching the non-existent json file
    // Directly pull from the verified global window data source
    const jobs = window.jobsData || [];
    
    if (!jobs || jobs.length === 0) {
      console.warn("No local jobs found inside window.jobsData");
    }
    
    // Call your existing UI rendering loop function with the array data
    renderJobs(jobs); 
    
  } catch (error) {
    console.error("Unable to load jobs:", error);
  }
}


window.jobsData = [
  {
    "id": 1,
    "title": "Saturday Retail Assistant",
    "company": "Local Bakery Co.",
    "location": "Leicester, UK",
    "minAge": 14,
    "wage": "£7.50 / hr",
    "tags": ["Weekend", "Part-time", "Retail"],
    "applyUrl": "/jobs/retail-assistant.html"
  },
  {
    "id": 2,
    "title": "Seasonal Cafe Staff",
    "company": "The Park Cafe",
    "location": "Nottingham, UK",
    "minAge": 16,
    "wage": "£8.60 / hr",
    "tags": ["Seasonal", "Flexible hours", "Catering"],
    "applyUrl": "/jobs/cafe-staff.html"
  }
];
