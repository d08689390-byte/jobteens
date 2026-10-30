import sqlite3
import asyncio
from datetime import datetime
from playwright.async_api import async_playwright

DB_NAME = "jobs.db"
TARGET_URL = "https://d08689390-byte.github.io/jobteens"  

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT,
            location TEXT,
            apply_url TEXT,
            date_scraped TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_job(job_id, title, company, location, apply_url):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(
            "INSERT INTO jobs (id, title, company, location, apply_url, date_scraped) VALUES (?, ?, ?, ?, ?, ?)",
            (job_id, title, company, location, apply_url, current_date)
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

async def scrape_jobs():
    print("🚀 Starting Jobteens Scraper...")
    init_db()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ignore_https_errors=True
        )
        page = await context.new_page()

        try:
            print(f"🔗 Navigating to {TARGET_URL}...")
            await page.goto(TARGET_URL, wait_until="networkidle", timeout=30000)

            # Target elements inside your exact HTML container structure
            job_elements = await page.query_selector_all("#jobs-list .job-card")
            print(f"📊 Scanning jobs-list container...")

            new_jobs_count = 0

            for index, element in enumerate(job_elements):
                title_elem = await element.query_selector(".job-title")
                company_elem = await element.query_selector(".company")
                location_elem = await element.query_selector(".location")
                link_elem = await element.query_selector("a")

                if not title_elem or not link_elem:
                    continue

                title = (await title_elem.inner_text()).strip()
                company = (await company_elem.inner_text()).strip() if company_elem else "JobTeens Employer"
                location = (await location_elem.inner_text()).strip() if location_elem else "UK"
                raw_url = await link_elem.get_attribute("href")

                if raw_url.startswith("http"):
                    apply_url = raw_url
                else:
                    apply_url = f"{TARGET_URL.rstrip('/')}/{raw_url.lstrip('/')}"

                # Generate unique DB id
                clean_slug = ''.join(filter(str.isalnum, title.lower()))[:10]
                job_id = f"jt-{index}-{clean_slug}"

                if save_job(job_id, title, company, location, apply_url):
                    print(f"✅ Saved to DB: \"{title}\" at {company} ({location})")
                    new_jobs_count += 1

            if new_jobs_count == 0:
                print("⚠️ Scraper finished. 0 new jobs found (they may already be in the database, or the site is empty).")
            else:
                print(f"🎉 Success! Added {new_jobs_count} new job(s) into jobs.db.")

        except Exception as e:
            print(f"❌ Scraping error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(scrape_jobs())
