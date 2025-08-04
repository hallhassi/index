import os
import json
from bs4 import BeautifulSoup

# The directory where your HTML pages are
HTML_DIR = '.'

# The directory where your images are
IMAGE_DIR = 'hi/'

# Your list of work titles
work_titles = [
    
    "comets comets",
    "4905",
    "mirror mirror",
    "bernie",
    "2001",
    "myparents",
    "apartment",
    "stephen",
    "mom",
    "sarah",
    "altcomicsmagazine1",
    "hawaii"
]

def format_title_for_filenames(title):
    """
    Formats a title string into a lowercase search pattern for filenames.
    Example: "comets comets" -> "comets-comets"
    """
    return title.lower().replace(" ", "-").replace("'", "")

def find_images_for_title(title):
    """
    Searches the IMAGE_DIR for all images whose filename contains at least one of the formatted title's keywords.
    Returns a list of all matching relative paths.
    """
    title_words = [word for word in title.lower().replace("'", "").split() if word not in ('a', 'and', 'the', 'is', 'for', 'of', 'in', '1-6', '7', '1', '2013', '2015', '2016', '2017', '2023', '2024', '2025', 'editor', 'author', 'curator', 'artist')]
    
    try:
        filenames = os.listdir(IMAGE_DIR)
    except FileNotFoundError:
        print(f"Error: Image directory '{IMAGE_DIR}' not found.")
        return []

    found_images = []
    for filename in filenames:
        filename_lower = filename.lower()
        if any(word in filename_lower for word in title_words) and filename_lower.endswith(('.png', '.jpg', '.jpeg', '.gif')):
            found_images.append(os.path.join(IMAGE_DIR, filename))
            
    return found_images

def create_initial_html_page(title):
    """
    Creates a new HTML file with a basic structure.
    """
    html_filename = format_title_for_filenames(title) + '.html'
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body>
    <h1>{title}</h1>
    <p>This is the page for '{title}'.</p>
    <p><a href="index.html">Back to main list</a></p>
</body>
</html>
"""
    with open(os.path.join(HTML_DIR, html_filename), 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"Created new page: {html_filename}")
    return html_filename

def update_html_page_with_js(title):
    """
    Finds all images for a title and embeds a JavaScript array into the HTML page.
    Creates the HTML page if it doesn't exist, and ensures an insertion point for the image.
    """
    html_filename = format_title_for_filenames(title) + '.html'
    html_filepath = os.path.join(HTML_DIR, html_filename)

    if not os.path.exists(html_filepath):
        create_initial_html_page(title)
    
    image_paths = find_images_for_title(title)

    with open(html_filepath, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Ensure a basic HTML structure exists before proceeding
    if not soup.html:
        soup = BeautifulSoup(f"<!DOCTYPE html><html lang='en'><head><title>{title}</title></head><body></body></html>", 'html.parser')
        print(f"No <html> tag found in {html_filepath}. Rebuilding a basic HTML structure.")

    # Remove any existing image tags and previous scripts for a clean slate
    for img_tag in soup.find_all('img'):
        img_tag.decompose()
    for script_tag in soup.find_all('script'):
        script_tag.decompose()

    # Create an image tag to hold the random image
    img_placeholder = soup.new_tag('img', id='randomImage', alt=f"Image for {title}")
    img_placeholder['style'] = 'max-width: 100%; height: auto; display: block; margin-bottom: 20px;'
    
    # Find an insertion point: first try after <h1>, then inside <body>, otherwise create a <body>
    h1_tag = soup.find('h1')
    body_tag = soup.find('body')

    if h1_tag:
        h1_tag.insert_after(img_placeholder)
    else:
        if not body_tag:
            body_tag = soup.new_tag('body')
            soup.html.append(body_tag)
            print(f"No <body> tag found in {html_filepath}. Creating one.")
        body_tag.append(img_placeholder)
        # If there's no h1, add one for better structure
        if not soup.find('h1'):
            h1_tag = soup.new_tag('h1')
            h1_tag.string = title
            body_tag.insert(0, h1_tag)
            print(f"No <h1> tag found in {html_filepath}. Adding one.")

    # Create the JavaScript script tag with the embedded image list
    js_content = f"""
<script>
    const imageList = {json.dumps(image_paths)};

    function displayRandomImage() {{
        const imageElement = document.getElementById('randomImage');
        if (imageList.length > 0) {{
            const randomIndex = Math.floor(Math.random() * imageList.length);
            imageElement.src = imageList[randomIndex];
        }} else {{
            imageElement.alt = "No images found.";
        }}
    }}

    window.onload = displayRandomImage;
</script>
"""
    script_tag = BeautifulSoup(js_content, 'html.parser').script
    soup.find('body').append(script_tag)

    with open(html_filepath, 'w', encoding='utf-8') as file:
        file.write(str(soup.prettify()))
        
    print(f"Updated '{html_filepath}' with JavaScript for random image selection.")

def main():
    """
    Main function to update all HTML pages.
    """
    for title in work_titles:
        update_html_page_with_js(title)

if __name__ == "__main__":
    main()