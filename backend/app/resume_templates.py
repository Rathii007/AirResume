from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
import logging
import os

# Logging Configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Theme Colors for "Orbits and Galaxies"
SPACE_BLACK = colors.Color(0.1, 0.1, 0.2)  # Dark background
GALAXY_PURPLE = colors.Color(0.4, 0.3, 0.6)  # Section headers
ORBIT_YELLOW = colors.Color(1, 0.8, 0.4)  # Accents
STAR_WHITE = colors.white  # Text

def draw_background(c, width, height):
    """Add a subtle space-themed background."""
    c.setFillColor(SPACE_BLACK)
    c.rect(0, 0, width, height, fill=1)
    # Add "stars" (small circles)
    c.setFillColor(STAR_WHITE)
    for x, y in [(100, 700), (200, 650), (300, 720), (400, 680)]:
        c.circle(x, y, 2, fill=1)

def wrap_text(c, text, x, y, max_width, font_size):
    """Wrap text to fit within page width and return new y position."""
    c.setFont("Helvetica", font_size)
    lines = []
    current_line = ""
    for word in text.split():
        if c.stringWidth(current_line + word, "Helvetica", font_size) < max_width:
            current_line += word + " "
        else:
            lines.append(current_line.strip())
            current_line = word + " "
    if current_line:
        lines.append(current_line.strip())
    
    for line in lines:
        c.drawString(x, y, line)
        y -= font_size + 2
    return y

def modern_template(file_path, data):
    """Generate a modern resume PDF with a space theme."""
    try:
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        draw_background(c, width, height)

        c.setFillColor(STAR_WHITE)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, height - 50, data.get("name", "Anonymous"))
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 70, f"{data.get('email', 'N/A')} | {data.get('phone', 'N/A')}")

        y = height - 100
        sections = ["Education", "Experience", "Skills"]
        for section in sections:
            c.setFillColor(GALAXY_PURPLE)
            c.setFont("Helvetica-Bold", 14)
            c.drawString(50, y, section)
            y -= 20
            c.setFillColor(STAR_WHITE)
            y = wrap_text(c, data.get(section.lower(), "N/A"), 50, y, width - 100, 12)
            y -= 10
            if y < 50:  # Prevent overflow
                break

        c.showPage()
        c.save()
        logger.info(f"Generated modern resume at {file_path}")
    except Exception as e:
        logger.error(f"Failed to generate modern resume: {str(e)}")
        raise

def classic_template(file_path, data):
    """Generate a classic resume with a subtle space twist."""
    try:
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        draw_background(c, width, height)

        c.setFillColor(STAR_WHITE)
        c.setFont("Times-Bold", 18)
        c.drawString(50, height - 50, data.get("name", "Anonymous"))
        c.setFont("Times-Roman", 12)
        c.drawString(50, height - 70, f"{data.get('email', 'N/A')} | {data.get('phone', 'N/A')}")

        y = height - 100
        sections = ["Education", "Experience", "Skills"]
        for section in sections:
            c.setFillColor(GALAXY_PURPLE)
            c.setFont("Times-Bold", 14)
            c.drawString(50, y, section)
            y -= 20
            c.setFillColor(STAR_WHITE)
            y = wrap_text(c, data.get(section.lower(), "N/A"), 50, y, width - 100, 12)
            y -= 10
            if y < 50:
                break

        c.showPage()
        c.save()
        logger.info(f"Generated classic resume at {file_path}")
    except Exception as e:
        logger.error(f"Failed to generate classic resume: {str(e)}")
        raise

def creative_template(file_path, data):
    """Generate a creative resume with orbiting accents."""
    try:
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        draw_background(c, width, height)

        c.setFillColor(ORBIT_YELLOW)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(50, height - 50, data.get("name", "Anonymous"))
        c.setFillColor(STAR_WHITE)
        c.setFont("Helvetica-Oblique", 12)
        c.drawString(50, height - 70, f"{data.get('email', 'N/A')} | {data.get('phone', 'N/A')}")

        y = height - 100
        sections = ["Education", "Experience", "Skills"]
        for section in sections:
            c.setFillColor(GALAXY_PURPLE)
            c.setFont("Helvetica-Bold", 16)
            c.drawString(50, y, section)
            c.setFillColor(ORBIT_YELLOW)
            c.circle(40, y + 5, 3, fill=1)  # Orbit accent
            y -= 20
            c.setFillColor(STAR_WHITE)
            y = wrap_text(c, data.get(section.lower(), "N/A"), 50, y, width - 100, 12)
            y -= 10
            if y < 50:
                break

        c.showPage()
        c.save()
        logger.info(f"Generated creative resume at {file_path}")
    except Exception as e:
        logger.error(f"Failed to generate creative resume: {str(e)}")
        raise

def executive_template(file_path, data):
    """Generate an executive resume with a formal space theme."""
    try:
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        draw_background(c, width, height)

        c.setFillColor(STAR_WHITE)
        c.setFont("Helvetica-Bold", 22)
        c.drawString(50, height - 50, data.get("name", "Anonymous"))
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 70, f"{data.get('email', 'N/A')} | {data.get('phone', 'N/A')}")

        y = height - 100
        sections = ["Education", "Experience", "Skills", "Certifications", "Achievements"]
        for section in sections:
            if section.lower() in data:
                c.setFillColor(GALAXY_PURPLE)
                c.setFont("Helvetica-Bold", 16)
                c.drawString(50, y, section)
                y -= 20
                c.setFillColor(STAR_WHITE)
                y = wrap_text(c, data.get(section.lower(), "N/A"), 50, y, width - 100, 12)
                y -= 10
                if y < 50:
                    break

        c.showPage()
        c.save()
        logger.info(f"Generated executive resume at {file_path}")
    except Exception as e:
        logger.error(f"Failed to generate executive resume: {str(e)}")
        raise

def minimalist_template(file_path, data):
    """Generate a minimalist resume with a clean space aesthetic."""
    try:
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        draw_background(c, width, height)

        c.setFillColor(STAR_WHITE)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, height - 50, data.get("name", "Anonymous"))
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 70, f"{data.get('email', 'N/A')} | {data.get('phone', 'N/A')}")

        y = height - 100
        sections = ["Education", "Experience", "Skills"]
        for section in sections:
            c.setFillColor(GALAXY_PURPLE)
            c.setFont("Helvetica", 14)
            c.drawString(50, y, section)
            y -= 20
            c.setFillColor(STAR_WHITE)
            y = wrap_text(c, data.get(section.lower(), "N/A"), 50, y, width - 100, 12)
            y -= 10
            if y < 50:
                break

        c.showPage()
        c.save()
        logger.info(f"Generated minimalist resume at {file_path}")
    except Exception as e:
        logger.error(f"Failed to generate minimalist resume: {str(e)}")
        raise

templates = {
    "modern": modern_template,
    "classic": classic_template,
    "creative": creative_template,
    "executive": executive_template,
    "minimalist": minimalist_template,
}