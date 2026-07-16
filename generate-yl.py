import os

# Define the HTML template with a placeholder for the two-digit number
html_template = """<html>
<head>
    <title>z by Blaise Larmee</title>
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
        <a class="buy" href="https://buy.stripe.com/3cI7sLdOq4XT0CG6ssbV600">BUY</a>
        <img src="hi/young-lions-artist-edition-{num}.jpg">
    </div>"""

# Generate pages from 01 to 10
for i in range(1, 11):
    # Format the number to be two digits with a leading zero (e.g., "01", "09", "10")
    num_str = f"{i:02d}"
    
    # Insert the formatted number into the template
    page_content = html_template.format(num=num_str)
    
    # Create the unique filename
    filename = f"young-lions-artist-edition-{num_str}.html"
    
    # Save the file
    with open(filename, "w", encoding="utf-8") as file:
        file.write(page_content)
        
    print(f"Created: {filename}")

print("\nAll 10 pages generated successfully!")