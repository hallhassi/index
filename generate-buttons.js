const Stripe = require('stripe');
// Pulls the key safely from the environment variable you saved
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const fs = require('fs');

const BASE_URL = "https://blaiselarmee.com/";

// --- 1. THE 6 UNIQUE ITEMS ---
const uniqueItems = [
    { name: "Comics Youth 2", slug: "comics-youth-2", price: 5 },
    { name: "Altcomics 7", slug: "altcomics-7", price: 7 },
    { name: "2001", slug: "2001", price: 25 },
    { name: "Mirror Mirror", slug: "mirror-mirror", price: 30 },
    { name: "Comics Youth 1", slug: "comics-youth-1", price: 5 },
    { name: "The Whale", slug: "the-whale", price: 50 },
];

// Compile all products into a single master array
const allProducts = [];

// Push unique items
for (const item of uniqueItems) {
    allProducts.push({
        name: item.name,
        priceInDollars: item.price,
        imageUrl: `${BASE_URL}lo/${item.slug}.jpg`,
        pageUrl: `${BASE_URL}${item.slug}.html`
    });
}

// --- 2. THE SIMPLE SET (Young Lions 01-10) ---
for (let i = 1; i <= 10; i++) {
    const paddedNum = String(i).padStart(2, '0'); // formats to "01", "02", etc.
    allProducts.push({
        name: `Young Lions (Artist Edition) ${paddedNum}`,
        priceInDollars: 25,
        imageUrl: `${BASE_URL}lo/young-lions-artist-edition-${paddedNum}.jpg`,
        pageUrl: `${BASE_URL}young-lions-artist-edition-${paddedNum}.html`
    });
}

// --- 3. THE COMPLEX SET (3 Books Artist Edition 01-28) ---
const complexPrices = {
    1: 500,
    2: 250,
    3: 200,
    4: 150, 5: 150, 6: 150, 7: 150, 8: 150, 9: 150, // 04 through 09 are $150
    10: 100, 11: 100, 12: 100 // 10 through 12 are $100
    // 13 through 28 will default to $50 dynamically in the loop below
};

for (let i = 1; i <= 28; i++) {
    const paddedNum = String(i).padStart(2, '0');
    const price = complexPrices[i] !== undefined ? complexPrices[i] : 50; // default to $50 if not specified

    allProducts.push({
        name: `3 Books Artist Edition ${paddedNum}`,
        priceInDollars: price,
        imageUrl: `${BASE_URL}lo/3-books-artist-edition-${paddedNum}.jpg`,
        pageUrl: `${BASE_URL}3-books-artist-edition-${paddedNum}.html`
    });
}

// --- THE STRIPE GENERATION FUNCTION ---
async function createStripeButtons() {
    console.log(`Starting generation for ${allProducts.length} items...`);
    const results = [];

    for (const prod of allProducts) {
        try {
            console.log(`Creating: ${prod.name} ($${prod.priceInDollars})...`);

            // A. Create the Product
            const product = await stripe.products.create({
                name: prod.name,
                images: [prod.imageUrl],
                metadata: { page_url: prod.pageUrl }
            });

            // B. Create the Price (Stripe handles amounts in cents, so multiplied by 100)
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: prod.priceInDollars * 100,
                currency: 'usd',
            });

            // C. Create the Payment Link (Buy Button URL)
            const paymentLink = await stripe.paymentLinks.create({
                line_items: [{ price: price.id, quantity: 1 }],
                after_completion: {
                    type: 'redirect',
                    redirect: { url: prod.pageUrl } // redirects back to your book page after checkout
                }
            });

            // Store the data mapped directly to your HTML layout
            results.push({
                name: prod.name,
                price: prod.priceInDollars,
                imageUrl: `lo/${prod.imageUrl.split('/lo/')[1]}`, // Relative path for your local src
                dataUrl: prod.pageUrl.replace(BASE_URL, ''),      // Relative path for your data-url attribute
                buyUrl: paymentLink.url
            });

            // Brief pause to satisfy rate limits
            await new Promise(resolve => setTimeout(resolve, 300));

        } catch (error) {
            console.error(`❌ Failed to create ${prod.name}:`, error.message);
        }
    }

    // --- OUTPUT A COMPLETED HTML SNIPPETS FILE ---
    let htmlOutput = "";
    results.forEach(item => {
        htmlOutput += `        <div class="book" data-url="${item.dataUrl}">\n`;
        htmlOutput += `            <img src="${item.imageUrl}">\n`;
        htmlOutput += `            <p>${item.name}</p>\n`;
        htmlOutput += `            <p>$${item.price}</p>\n`;
        htmlOutput += `            <a class="buy" href="${item.buyUrl}">BUY</a>\n`;
        htmlOutput += `        </div>\n\n`;
    });

    fs.writeFileSync('generated_buttons.html', htmlOutput);
    console.log("\n🎉 Success! All buttons generated. Check 'generated_buttons.html' for your code snippets.");
}

createStripeButtons();