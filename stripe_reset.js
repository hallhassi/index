const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function cleanSlate() {
  try {
    // --- 1. DEACTIVATE ALL PAYMENT LINKS ---
    console.log("Step 1: Deactivating active payment links...");
    let linkCount = 0;
    
    for await (const link of stripe.paymentLinks.list({ active: true })) {
      console.log(`Deactivating Link: ${link.id} (${link.url})`);
      await stripe.paymentLinks.update(link.id, { active: false });
      linkCount++;
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit pause
    }
    console.log(`Successfully deactivated ${linkCount} payment links.\n`);

    // --- 2. ARCHIVE ALL PRODUCTS ---
    console.log("Step 2: Archiving active products from catalog...");
    let productCount = 0;

    for await (const product of stripe.products.list({ active: true })) {
      console.log(`Archiving Product: ${product.name} (${product.id})`);
      await stripe.products.update(product.id, { active: false });
      productCount++;
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit pause
    }
    console.log(`Successfully archived ${productCount} products.\n`);

    console.log(`🎉 All done! Your Stripe account is now a clean slate.`);

  } catch (error) {
    console.error("❌ An error occurred during the clean slate process:", error.message);
  }
}

cleanSlate();