import os
import sqlite3
import asyncio
from datetime import datetime
import discord
from discord import app_commands
from discord.ext import commands, tasks
from dotenv import load_dotenv
from playwright.async_api import async_playwright

# Configuration Environment Variables
load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")
DB_NAME = "jobs.db"
TARGET_URL = "https://d08689390-byte.github.io/jobteens"  # Updated to the correct target URL for scraping

# Paste your active development discord server ID layout sequence here
TEST_SERVER_ID = "1555605402052198484"
# Change this to the exact name of the public channel where you want live job alerts sent
ALERT_CHANNEL_NAME = "new-jobs"

# Set up intents
intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True

class JobTeensPlatformBot(commands.Bot):
  def __init__(self):
    super().__init__(command_prefix="!", intents=intents)

  async def setup_hook(self):
    # Initialize upgraded database tables
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # 1. Main Job listings table with explicit Age constraint logging
    cursor.execute('''
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT,
        location TEXT,
        age_limit INTEGER,
        apply_url TEXT,
        date_scraped TEXT
      )
    ''')

    # 2. Linked profile data architecture matrix
    cursor.execute('''
      CREATE TABLE IF NOT EXISTS linked_users (
        discord_id TEXT PRIMARY KEY,
        jobteens_email TEXT NOT NULL,
        date_linked TEXT
      )
    ''')

    # 3. Action event metrics log tracking database
    cursor.execute('''
      CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT,
        action_type TEXT,
        detail TEXT,
        timestamp TEXT
      )
    ''')
    conn.commit()
    conn.close()

    # Synchronize your slash commands directory straight into your server
    try:
      guild = discord.Object(id=int(TEST_SERVER_ID))
      self.tree.copy_global_to(guild=guild)
      await self.tree.sync(guild=guild)
      print(f"⚡ Core system synchronization complete. Guild Link verified: {TEST_SERVER_ID}")
    except Exception as e:
      print(f"❌ Synchronization framework anomaly: {e}")

    # Kickstart the automated background scraping loop sequence execution path
    self.automated_scraper_loop.start()

  # Background Engine: Runs quietly behind the scenes every 6 hours
  @tasks.loop(hours=6.0)
  async def automated_scraper_loop(self):
    print("🕒 Background Task Triggered: Synchronising website listings database matrix...")
    await run_background_scraper(self)

  @automated_scraper_loop.before_loop
  async def before_scraper_start(self):
    await self.wait_until_ready()

bot = JobTeensPlatformBot()

@bot.event
async def on_ready():
  print(f"✅ Connection online! Active Node: {bot.user}")
  await bot.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name="JobTeens Portal"))

# ==================== DATA PLATFORM SCRAPER ENGINE ====================

async def run_background_scraper(bot_instance):
  """Integrated Playwright browser routine that safely extracts and alerts on new data configurations."""
  async with async_playwright() as p:
    browser = await p.chromium.launch(headless=True)
    context = await browser.new_context(
      user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ignore_https_errors=True
    )
    page = await context.new_page()

    try:
      await page.goto(TARGET_URL, wait_until="networkidle", timeout=30000)
      job_elements = await page.query_selector_all("#jobs-list .job-card")

      conn = sqlite3.connect(DB_NAME)
      cursor = conn.cursor()

      new_listings_discovered = []

      for index, element in enumerate(job_elements):
        title_elem = await element.query_selector(".job-title")
        company_elem = await element.query_selector(".company")
        location_elem = await element.query_selector(".location")
        age_elem = await element.query_selector(".age-requirement")
        link_elem = await element.query_selector("a")

        if not title_elem or not link_elem:
          continue

        title = (await title_elem.inner_text()).strip()
        company = (await company_elem.inner_text()).strip() if company_elem else "JobTeens Employer"
        location = (await location_elem.inner_text()).strip() if location_elem else "UK"

        # Dynamic internal parsing conversion configuration for age labels (e.g. "Age: 14+" -> 14)
        age_text = (await age_elem.inner_text()).strip() if age_elem else "13"
        age_limit = 13
        for word in age_text.split():
          clean_word = ''.join(filter(str.isdigit, word))
          if clean_word:
            age_limit = int(clean_word)
            break

        raw_url = await link_elem.get_attribute("href")
        apply_url = raw_url if raw_url.startswith("http") else f"{TARGET_URL.rstrip('/')}/{raw_url.lstrip('/')}"

        clean_slug = ''.join(filter(str.isalnum, title.lower()))[:10]
        job_id = f"jt-{index}-{clean_slug}"

        # Audit configuration check against duplicate identity keys in DB
        cursor.execute("SELECT id FROM jobs WHERE id = ?", (job_id,))
        if not cursor.fetchone():
          current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
          cursor.execute(
            "INSERT INTO jobs (id, title, company, location, age_limit, apply_url, date_scraped) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (job_id, title, company, location, age_limit, apply_url, current_date)
          )
          new_listings_discovered.append((title, company, location, age_limit, apply_url))

      conn.commit()
      conn.close()

      # Broadcaster Section: Alerts the entire server about new entries instantly
      if new_listings_discovered:
        print(f"📢 Isolated {len(new_listings_discovered)} brand new openings! Pushing out announcements...")
        for guild in bot_instance.guilds:
          channel = discord.utils.get(guild.text_channels, name=ALERT_CHANNEL_NAME)
          if channel:
            for title, company, location, age, url in new_listings_discovered:
              embed = discord.Embed(
                title=f"🚨 New Job Listing Posted!",
                description=f"**{title}** is looking for candidates right now on JobTeens.",
                color=discord.Color.brand_green()
              )
              embed.add_field(name="🏢 Employer", value=company, inline=True)
              embed.add_field(name="📍 Location", value=location, inline=True)
              embed.add_field(name="🔞 Eligibility", value=f"Ages {age}+", inline=True)

              view = discord.ui.View()
              view.add_item(discord.ui.Button(label="View Listing", url=url, style=discord.ButtonStyle.link))
              await channel.send(embed=embed, view=view)

    except Exception as e:
      print(f"❌ Automation engine loop exception sequence error: {e}")
    finally:
      await browser.close()

# ==================== DATA TRANSIT CORE MANAGEMENT HELPERS ====================

def log_activity(discord_id, action_type, detail):
  conn = sqlite3.connect(DB_NAME)
  cursor = conn.cursor()
  cursor.execute(
    "INSERT INTO user_activity (discord_id, action_type, detail, timestamp) VALUES (?, ?, ?, ?)",
    (str(discord_id), action_type, detail, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
  )
  conn.commit()
  conn.close()

# ==================== COMMAND MODULE INTEGRATION MAPS ====================

# ADVANCED FEATURE 3: /jobs command updated with multi-variable dynamic filter parameter slots
@bot.tree.command(name="jobs", description="Browse live teen jobs. Filter optionally by minimum age or location.")
@app_commands.describe(age="Filter by eligibility age (e.g. 14, 16)", location="Filter by town/city location name")
async def jobs(interaction: discord.Interaction, age: int = None, location: str = None):
  await interaction.response.defer(ephemeral=True)

  conn = sqlite3.connect(DB_NAME)
  cursor = conn.cursor()

  # Build a fluid, conditional dynamic SQL string pipeline query
  query = "SELECT title, company, location, age_limit, apply_url FROM jobs WHERE 1=1"
  params = []

  if age is not None:
    query += " AND age_limit <= ?"
    params.append(age)
  if location:
    query += " AND location LIKE ?"
    params.append(f"%{location.strip()}%")

  query += " ORDER BY date_scraped DESC LIMIT 5"
  cursor.execute(query, params)
  listings = cursor.fetchall()
  conn.close()

  if not listings:
    await interaction.followup.send("⚠️ No active jobs match your selected filter criteria currently.", ephemeral=True)
    return

  log_activity(interaction.user.id, "SEARCH", f"Filtered Age: {age} | Loc: {location}")

  for title, company, loc, limit, apply_url in listings:
    embed = discord.Embed(
      title=f"💼 {title}",
      description="Position verified active inside the data pipeline database records.",
      color=discord.Color.blue()
    )
    embed.add_field(name="🏢 Company", value=company, inline=True)
    embed.add_field(name="📍 Location", value=loc, inline=True)
    embed.add_field(name="🔞 Eligibility", value=f"Suitable for ages {limit}+", inline=True)
    view = discord.ui.View()
    view.add_item(discord.ui.Button(label="Apply via JobTeens", url=apply_url, style=discord.ButtonStyle.link))
    await interaction.followup.send(embed=embed, view=view, ephemeral=True)

@bot.tree.command(name="link", description="Link your Discord account credentials straight to your JobTeens account.")
@app_commands.describe(email="The exact registered email address you use on your profile account page")
async def link(interaction: discord.Interaction, email: str):
  if "@" not in email or "." not in email:
    await interaction.response.send_message("❌ Inbound parameter verification error: Please type a legitimate structural email format.", ephemeral=True)
    return
  conn = sqlite3.connect(DB_NAME)
  cursor = conn.cursor()
  current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  cursor.execute("INSERT OR REPLACE INTO linked_users (discord_id, jobteens_email, date_linked) VALUES (?, ?, ?)",
                 (str(interaction.user.id), email.strip(), current_time))
  conn.commit()
  conn.close()
  log_activity(interaction.user.id, "ACCOUNT_LINK", email.strip())
  await interaction.response.send_message(f"✅ Registration verification successful! Your profile is mapped onto: {email}", ephemeral=True)

@bot.tree.command(name="apply", description="Request execution application parameters routes privately.")
@app_commands.describe(job_title="The explicit job keyword title string layout parameter description")
async def apply(interaction: discord.Interaction, job_title: str):
  conn = sqlite3.connect(DB_NAME)
  cursor = conn.cursor()
  cursor.execute("SELECT jobteens_email FROM linked_users WHERE discord_id = ?", (str(interaction.user.id),))
  user_row = cursor.fetchone()
  if not user_row:
    conn.close()
    await interaction.response.send_message("❌ Access Control Block: Account map link not discovered. Please perform a verification execution sweep using /link first.", ephemeral=True)
    return
  cursor.execute("SELECT title, apply_url FROM jobs WHERE title LIKE ? LIMIT 1", (f"%{job_title}%",))
  job_row = cursor.fetchone()
  conn.close()
  if not job_row:
    await interaction.response.send_message(f'⚠️ Search index error: Unable to map match strings onto index rows for "{job_title}".', ephemeral=True)
    return
  actual_title, apply_url = job_row
  log_activity(interaction.user.id, "APPLICATION_INTENT", actual_title)
  embed = discord.Embed(
    title=f"📝 Complete Application: {actual_title}",
    description=f"Verified validation handle: {user_row[0]}.\n\nClick below to access your candidate panel on the platform website configuration screen.",
    color=discord.Color.gold()
  )
  view = discord.ui.View()
  view.add_item(discord.ui.Button(label="Launch Application Flow Portal", url=apply_url, style=discord.ButtonStyle.link))
  await interaction.response.send_message(embed=embed, view=view, ephemeral=True)

# ADVANCED FEATURE 4: Dynamic Tracking Statistics Panel Dashboard (/status)

@bot.tree.command(name="status", description="Review your confidential profile tracking parameters, link statuses, and action logs.")
async def status(interaction: discord.Interaction):
  await interaction.response.defer(ephemeral=True)
  conn = sqlite3.connect(DB_NAME)
  cursor = conn.cursor()
  cursor.execute("SELECT jobteens_email, date_linked FROM linked_users WHERE discord_id = ?", (str(interaction.user.id),))
  account_row = cursor.fetchone()
  cursor.execute("SELECT action_type, detail, timestamp FROM user_activity WHERE discord_id = ? ORDER BY id DESC LIMIT 3", (str(interaction.user.id),))
  logs = cursor.fetchall()
  conn.close()
  embed = discord.Embed(
    title=f"👤 Candidate Data Dashboard: {interaction.user.name}",
    color=discord.Color.purple()
  )
  if account_row:
    embed.add_field(name="📧 Connected Email Profile", value=account_row[0], inline=False)
    embed.add_field(name="⏳ Validation Activation Date", value=account_row[1], inline=False)
  else:
    embed.add_field(name="📧 Connected Email Profile", value="⚠️ Account Link Status: Disconnected", inline=False)
  history_text = ""
  if logs:
    for action, details, stamp in logs:
      history_text += f"• [{action}] {details} ({stamp})\n"
  else:
    history_text = "No local activity history logged in database indexes yet."
  embed.add_field(name="📊 Recent Activity Telemetry", value=history_text, inline=False)
  await interaction.followup.send(embed=embed, ephemeral=True)

if __name__ == "__main__":
  if not TOKEN:
    print("❌ Operational Configuration Fault: DISCORD_TOKEN target variable null.")
  else:
    bot.run(TOKEN)