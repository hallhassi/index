import os
import json

# 1. Load the generated Stripe links mapping file
try:
    with open("stripe_links.json", "r", encoding="utf-8") as f:
        stripe_data = json.load(f)
    # Create a fast lookup map: { "filename.html": "https://buy.stripe.com/abc..." }
    link_map = {item["dataUrl"]: item["buyUrl"] for item in stripe_data}
except FileNotFoundError:
    print("❌ Error: 'stripe_links.json' not found. Run your Node.js generator first!")
    exit(1)

# Define the HTML template with placeholders for formatting
html_template = """<html>
<head>
    <title>Young Lions by Blaise Larmee</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css.css">
</head>
<body id="book">
    <div id="header">
        <a href="index.html">Blaise Larmee</a>
        <a href="books.html">books</a>
        <a href="shows.html">shows</a>
    </div>
    <div class="center">
        <h1>Young Lions Artist Edition {num}</h1>
        <img src="lo/young-lions-artist-edition-{num}.jpg">
        <p>$25, 96 pages, half letter, self-published, 2009</p>
        <a class="buy" href="{buy_url}">BUY</a>
        <img src="hi/young-lions-artist-edition-{num}.jpg">
        <a href="young-lions-artist-editions.html">Young Lions Artist Editions</a>
    </div>"""

# Generate pages from 01 to 10
for i in range(1, 11):
    num_str = f"{i:02d}"
    filename = f"young-lions-artist-edition-{num_str}.html"
    
    # 2. Lookup the dynamic buy url from our map
    buy_url = link_map.get(filename, "#")
    if buy_url == "#":
        print(f"⚠️ Warning: No Stripe link found for {filename}")

    # Insert the values into the template
    page_content = html_template.format(num=num_str, buy_url=buy_url)
    
    # Save the file
    with open(filename, "w", encoding="utf-8") as file:
        file.write(page_content)
        
    print(f"Created: {filename}")

print("\nAll 10 pages generated successfully!")