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
    "3 books",
    "mirror mirror",
    "bernie",
    "2001",
    "my parents",
    "altcomics magazine 1-6",
    "hawaii",
    "rogues gallery",
    "stephen story",
    "mom's mad at me",
    "sarah story altcomics magazine 7"
]

def format_title_for_filenames(title):
    """
    Formats a title string into a lowercase search pattern for filenames.
    Example: "comets comets" -> "comets-comets"
    """
    return title.lower().replace(" ", "-").replace("'", "")

def find_images_for_title(title):
    """
    Searches the IMAGE_DIR for all images whose filename contains the formatted title.
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
        if all(word in filename_lower for word in title_words) and filename_lower.endswith(('.png', '.jpg', '.jpeg', '.gif')):
            found_images.append(os.path.join(IMAGE_DIR, filename))
            
    return found_images

def update_html_page_with_js(title):
    """
    Finds all images for a title and embeds a JavaScript array into the HTML page.
    """
    html_filename = format_title_for_filenames(title) + '.html'
    html_filepath = os.path.join(HTML_DIR, html_filename)

    image_paths = find_images_for_title(title)

    if not os.path.exists(html_filepath):
        print(f"Skipping: HTML file '{html_filepath}' not found.")
        return

    with open(html_filepath, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Remove any existing image tags and previous scripts for a clean slate
    for img_tag in soup.find_all('img'):
        img_tag.decompose()
    for script_tag in soup.find_all('script'):
        script_tag.decompose()

    # Create an image tag to hold the random image
    img_placeholder = soup.new_tag('img', id='randomImage', alt=f"Image for {title}")
    img_placeholder['style'] = 'max-width: 100%; height: auto; display: block; margin-bottom: 20px;'
    
    h1_tag = soup.find('h1')
    if h1_tag:
        h1_tag.insert_after(img_placeholder)
    else:
        body_tag = soup.find('body')
        if body_tag:
            body_tag.append(img_placeholder)
        else:
            print(f"Could not find a place to insert images in {html_filepath}")
            return

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