import re

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

def format_title_to_filename(title):
    """
    Formats a title string into a lowercase filename with dashes.
    Example: "my parents" -> "my-parents.html"
    """
    # Replace spaces with dashes, remove other special characters, and convert to lowercase
    # The regex `[^\w\s]` matches anything that is not a word character or whitespace
    # We allow the single quote for "mom's mad at me"
    filename = re.sub(r'[^\w\s\']', '', title)
    filename = filename.replace(" ", "-")
    filename = filename.lower()
    return f"{filename}.html"

def create_html_page(title, filename):
    """
    Creates a new HTML file with a basic structure.
    """
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
    with open(filename, 'w') as f:
        f.write(html_content)
    print(f"Created page: {filename}")

def main():
    """
    Main function to process the list and create all pages.
    """
    for title in work_titles:
        filename = format_title_to_filename(title)
        create_html_page(title, filename)

if __name__ == "__main__":
    main()