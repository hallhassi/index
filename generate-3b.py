import os

# Define the dataset mapping the two-digit number to its price
books_data = [
    { "number": "01", "price": 500 },
    { "number": "02", "price": 250 },
    { "number": "03", "price": 200 },
    { "number": "04", "price": 150 },
    { "number": "05", "price": 150 },
    { "number": "06", "price": 150 },
    { "number": "07", "price": 150 },
    { "number": "08", "price": 150 },
    { "number": "09", "price": 150 },
    { "number": "10", "price": 100 },
    { "number": "11", "price": 100 },
    { "number": "12", "price": 100 },
    { "number": "13", "price": 50 },
    { "number": "14", "price": 50 },
    { "number": "15", "price": 50 },
    { "number": "16", "price": 50 },
    { "number": "17", "price": 50 },
    { "number": "18", "price": 50 },
    { "number": "19", "price": 50 },
    { "number": "20", "price": 50 },
    { "number": "21", "price": 50 },
    { "number": "22", "price": 50 },
    { "number": "23", "price": 50 },
    { "number": "24", "price": 50 },
    { "number": "25", "price": 50 },
    { "number": "26", "price": 50 },
    { "number": "27", "price": 50 },
    { "number": "28", "price": 50 }
]

# Define the HTML template with placeholders for the number and price
html_template = """<html>
<head>
    <title>3 Books by Blaise Larmee</title>
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
        <h1>3 Books Artist Edition {num}</h1>
        <p>${price}, 0 pages, 6 by 9 inches, 2dcloud, 2015</p>
        <a class="buy" href="https://buy.stripe.com/3cI7sLdOq4XT0CG6ssbV600">BUY</a>
        <img src="hi/3-books-artist-edition-{num}.jpg">
        <a href="3-books-artist-editions.html">3 Books Artist Editions</a>
    </div>"""

# Loop through the list of book data to generate pages
for book in books_data:
    num_str = book["number"]
    price_val = book["price"]
    
    # Insert the formatted number and price into the template
    page_content = html_template.format(num=num_str, price=price_val)
    
    # Create the unique filename
    filename = f"3-books-artist-edition-{num_str}.html"
    
    # Save the file
    with open(filename, "w", encoding="utf-8") as file:
        file.write(page_content)
        
    print(f"Created: {filename} with price ${price_val}")

print("\nAll pages generated successfully!")