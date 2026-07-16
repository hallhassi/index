const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const fs = require('fs');

const BASE_URL = "https://blaiselarmee.com/";

// --- 1. THE UNIQUE ITEMS (Includes Shipping Tiers and Inventory Counts) ---
const uniqueItems = [
    { name: "Comics Youth 2", slug: "comics-youth-2", price: 5, shippingTier: "letter" },
    { name: "Altcomics 7", slug: "altcomics-7", price: 7, shippingTier: "package" },
    { name: "2001", slug: "2001", price: 25, shippingTier: "heavyBook" }, // Now $25 INTL
    { name: "Mirror Mirror", slug: "mirror-mirror", price: 30, shippingTier: "heavyBook" }, // Now $25 INTL
    { name: "Comics Youth 1", slug: "comics-youth-1", price: 5, shippingTier: "letter" },
    { name: "The Whale", slug: "the-whale", price: 50, shippingTier: "package", inventoryLimit: 17 }, 
];

// --- 2. THE SPECIFIC BUNDLES (With custom image mappings) ---
const bundles = [
    {
        name: "Comics Youth 1 & 2 Zine Bundle",
        slug: "comics-youth-1+2",
        price: 10,
        shippingTier: "letter",
        imageUrl: `${BASE_URL}combo-01.png`, // Pointing to your custom combo-01.png
        pageUrl: `${BASE_URL}books.html` 
    },
    {
        name: "2001 & Mirror Mirror Heavy Book Combo",
        slug: "2001+mirror-mirror",
        price: 55,
        shippingTier: "heavyPackage", // Custom heavy shipping tier ($5 DOM / $50 INTL)
        imageUrl: `${BASE_URL}combo-02.png`, // Pointing to your custom combo-02.png
        pageUrl: `${BASE_URL}books.html`
    }
];

const allProducts = [];

// Push unique items
for (const item of uniqueItems) {
    allProducts.push({
        name: item.name,
        priceInDollars: item.price,
        imageUrl: `${BASE_URL}lo/${item.slug}.jpg`,
        pageUrl: `${BASE_URL}${item.slug}.html`,
        shippingTier: item.shippingTier,
        inventoryLimit: item.inventoryLimit || null
    });
}

// Push bundles
for (const bundle of bundles) {
    allProducts.push({
        name: bundle.name,
        priceInDollars: bundle.price,
        imageUrl: bundle.imageUrl,
        pageUrl: bundle.pageUrl,
        shippingTier: bundle.shippingTier,
        inventoryLimit: null
    });
}

// --- 3. THE SIMPLE SET (Young Lions 01-10) ---
for (let i = 1; i <= 10; i++) {
    const paddedNum = String(i).padStart(2, '0');
    allProducts.push({
        name: `Young Lions (Artist Edition) ${paddedNum}`,
        priceInDollars: 25,
        imageUrl: `${BASE_URL}lo/young-lions-artist-edition-${paddedNum}.jpg`,
        pageUrl: `${BASE_URL}young-lions-artist-edition-${paddedNum}.html`,
        shippingTier: "package",
        inventoryLimit: 1 
    });
}

// --- 4. THE COMPLEX SET (3 Books Artist Edition 01-28) ---
const complexPrices = {
    1: 500, 2: 250, 3: 200,
    4: 150, 5: 150, 6: 150, 7: 150, 8: 150, 9: 150,
    10: 100, 11: 100, 12: 100
};

for (let i = 1; i <= 28; i++) {
    const paddedNum = String(i).padStart(2, '0');
    const price = complexPrices[i] !== undefined ? complexPrices[i] : 50;

    allProducts.push({
        name: `3 Books Artist Edition ${paddedNum}`,
        priceInDollars: price,
        imageUrl: `${BASE_URL}lo/3-books-artist-edition-${paddedNum}.jpg`,
        pageUrl: `${BASE_URL}3-books-artist-edition-${paddedNum}.html`,
        shippingTier: "package",
        inventoryLimit: 1 
    });
}

// --- Helper: Retrieve or Setup Shipping Rates dynamically ---
async function getOrCreateShippingRates() {
    console.log("Checking and setting up shipping rates in Stripe...");

    const activeRates = await stripe.shippingRates.list({ active: true, limit: 100 });
    
    let domLetter = activeRates.data.find(r => r.display_name === 'Domestic Shipping (Letter)');
    let intlLetter = activeRates.data.find(r => r.display_name === 'International Shipping (Letter)');
    
    let domPackage = activeRates.data.find(r => r.display_name === 'Domestic Shipping (Media Mail)');
    let intlPackage = activeRates.data.find(r => r.display_name === 'International Shipping (Parcel)');

    // Individual Heavy Books ($5 DOM / $25 INTL)
    let domHeavyBook = activeRates.data.find(r => r.display_name === 'Domestic Heavy Book Shipping');
    let intlHeavyBook = activeRates.data.find(r => r.display_name === 'International Heavy Book Shipping');

    // Heavy Combos ($5 DOM / $50 INTL)
    let domHeavyPackage = activeRates.data.find(r => r.display_name === 'Domestic Heavy Combo Shipping');
    let intlHeavyPackage = activeRates.data.find(r => r.display_name === 'International Heavy Combo Shipping');

    if (!domLetter) {
        domLetter = await stripe.shippingRates.create({
            display_name: 'Domestic Shipping (Letter)',
            type: 'fixed_amount',
            fixed_amount: { amount: 200, currency: 'usd' },
        });
    }
    if (!intlLetter) {
        intlLetter = await stripe.shippingRates.create({
            display_name: 'International Shipping (Letter)',
            type: 'fixed_amount',
            fixed_amount: { amount: 600, currency: 'usd' },
        });
    }
    if (!domPackage) {
        domPackage = await stripe.shippingRates.create({
            display_name: 'Domestic Shipping (Media Mail)',
            type: 'fixed_amount',
            fixed_amount: { amount: 500, currency: 'usd' },
        });
    }
    if (!intlPackage) {
        intlPackage = await stripe.shippingRates.create({
            display_name: 'International Shipping (Parcel)',
            type: 'fixed_amount',
            fixed_amount: { amount: 2000, currency: 'usd' },
        });
    }
    if (!domHeavyBook) {
        domHeavyBook = await stripe.shippingRates.create({
            display_name: 'Domestic Heavy Book Shipping',
            type: 'fixed_amount',
            fixed_amount: { amount: 500, currency: 'usd' },
        });
    }
    if (!intlHeavyBook) {
        intlHeavyBook = await stripe.shippingRates.create({
            display_name: 'International Heavy Book Shipping',
            type: 'fixed_amount',
            fixed_amount: { amount: 2500, currency: 'usd' }, // $25.00 INTL shipping
        });
    }
    if (!domHeavyPackage) {
        domHeavyPackage = await stripe.shippingRates.create({
            display_name: 'Domestic Heavy Combo Shipping',
            type: 'fixed_amount',
            fixed_amount: { amount: 500, currency: 'usd' },
        });
    }
    if (!intlHeavyPackage) {
        intlHeavyPackage = await stripe.shippingRates.create({
            display_name: 'International Heavy Combo Shipping',
            type: 'fixed_amount',
            fixed_amount: { amount: 5000, currency: 'usd' }, // $50.00 INTL shipping
        });
    }

    return {
        letter: [ { shipping_rate: domLetter.id }, { shipping_rate: intlLetter.id } ],
        package: [ { shipping_rate: domPackage.id }, { shipping_rate: intlPackage.id } ],
        heavyBook: [ { shipping_rate: domHeavyBook.id }, { shipping_rate: intlHeavyBook.id } ],
        heavyPackage: [ { shipping_rate: domHeavyPackage.id }, { shipping_rate: intlHeavyPackage.id } ]
    };
}

// --- THE STRIPE GENERATION FUNCTION ---
async function createStripeButtons() {
    console.log(`Starting generation for ${allProducts.length} items...`);
    const results = [];

    let shippingRates;
    try {
        shippingRates = await getOrCreateShippingRates();
    } catch (e) {
        console.error("❌ Failed to initialize shipping rates:", e.message);
        return;
    }

    for (const prod of allProducts) {
        try {
            console.log(`Creating: ${prod.name} ($${prod.priceInDollars})...`);

            const product = await stripe.products.create({
                name: prod.name,
                images: [prod.imageUrl],
                metadata: { page_url: prod.pageUrl }
            });

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: prod.priceInDollars * 100,
                currency: 'usd',
            });

            const selectedShipping = shippingRates[prod.shippingTier] || shippingRates.package;

            const paymentLinkPayload = {
                line_items: [{ price: price.id, quantity: 1 }],
                shipping_address_collection: {
                    allowed_countries: ['US', 'CA', 'GB', 'FR', 'DE', 'JP', 'AU'],
                },
                shipping_options: selectedShipping,
                after_completion: {
                    type: 'redirect',
                    redirect: { url: prod.pageUrl } 
                }
            };

            // Apply stock limits (e.g., 1 for artist editions, 17 for The Whale)
            if (prod.inventoryLimit !== null) {
                paymentLinkPayload.restrictions = {
                    completed_sessions: {
                        limit: prod.inventoryLimit
                    }
                };
            }

            const paymentLink = await stripe.paymentLinks.create(paymentLinkPayload);

            // Structure data cleanly for the JSON lookup file
            let imagePath = prod.imageUrl.includes('/lo/') 
                ? `lo/${prod.imageUrl.split('/lo/')[1]}` 
                : prod.imageUrl.replace(BASE_URL, '');

            results.push({
                name: prod.name,
                price: prod.priceInDollars,
                imageUrl: imagePath, 
                dataUrl: prod.pageUrl.replace(BASE_URL, ''),      
                buyUrl: paymentLink.url
            });

            await new Promise(resolve => setTimeout(resolve, 300));

        } catch (error) {
            console.error(`❌ Failed to create ${prod.name}:`, error.message);
        }
    }

    // --- OUTPUT HTML FILE & JSON DATA FILE ---
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
    fs.writeFileSync('stripe_links.json', JSON.stringify(results, null, 2));

    console.log("\n🎉 Success! All buttons, custom shipping tiers, and JSON maps generated.");
}

createStripeButtons();