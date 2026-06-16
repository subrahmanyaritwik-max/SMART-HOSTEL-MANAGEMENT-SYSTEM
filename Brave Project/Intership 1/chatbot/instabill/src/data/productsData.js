// src/data/productsData.js

const categories = [
  "Groceries",
  "Dairy",
  "Bakery",
  "Beverages",
  "Frozen Foods",
  "Snacks",
  "Household",
  "Personal Care",
  "Baby Care",
  "Health Products"
];

// Seed images from Unsplash for realism
const imagesMap = {
  // Special Products
  "Rice": "https://c.cdnmp.net/482221562/p/m/1/orez-alb-basmati-ranbir-bio-500-g~2881.jpg",
  "Sugar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLtQ6jZIUANmkdQZr24bb_a8tTljfAGqbJg&s",
  "Milk": "https://images.immediate.co.uk/production/volatile/sites/30/2020/02/Glass-and-bottle-of-milk-fe0997a.jpg",
  "Bread": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0rv_WYWixSRRSfTKvNgYiqfmxaeqQfFf4bg&s",
  "Salt": "https://zuzkalight.com/wp-content/uploads/2019/07/the_importance_of_salt.jpg",
  "Cooking Oil": "https://m.media-amazon.com/images/I/616gnRopZDL.AC_UF894,1000_QL80.jpg",
  "Tea Powder": "https://i.ebayimg.com/images/g/3rUAAOSwqeBgy3Wq/s-l1600.webp",
  "Biscuits": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSShu1mZnGFbOqYALfFvx1cWoMI8a5P4ccOhw&s",

  // Groceries
  "Wheat Flour": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60",
  "Red Lentils": "https://images.unsplash.com/photo-1585996388417-640a324a9cfb?w=400&auto=format&fit=crop&q=60",
  "Organic Honey": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=60",
  "Mixed Spices": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=60",

  // Dairy
  "Salted Butter": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop&q=60",
  "Cheddar Cheese": "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=400&auto=format&fit=crop&q=60",
  "Greek Yogurt": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=60",
  "Fresh Paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=60",
  "Whipping Cream": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=60",

  // Bakery
  "Chocolate Chip Cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format&fit=crop&q=60",
  "Blueberry Muffins": "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&auto=format&fit=crop&q=60",
  "Butter Croissants": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=60",
  "Burger Buns": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60",

  // Beverages
  "Roasted Coffee Beans": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&auto=format&fit=crop&q=60",
  "Orange Juice": "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=60",
  "Energy Drink": "https://images.unsplash.com/photo-1622543956221-15bfae1d8a76?w=400&auto=format&fit=crop&q=60",
  "Green Tea Bags": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&auto=format&fit=crop&q=60",

  // Frozen Foods
  "Frozen French Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=60",
  "Vanilla Ice Cream": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&auto=format&fit=crop&q=60",
  "Frozen Green Peas": "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=60",
  "Veg Spring Rolls": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=60",

  // Snacks
  "Potato Chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=60",
  "Cheese Popcorn": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&auto=format&fit=crop&q=60",
  "Salted Peanuts": "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&auto=format&fit=crop&q=60",
  "Dark Chocolate Bar": "https://images.unsplash.com/photo-1548907040-4d42b52125e0?w=400&auto=format&fit=crop&q=60",

  // Household
  "Laundry Detergent": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&auto=format&fit=crop&q=60",
  "Dishwashing Liquid": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&auto=format&fit=crop&q=60",
  "Garbage Bags": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&auto=format&fit=crop&q=60",
  "Paper Towels": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&auto=format&fit=crop&q=60",

  // Personal Care
  "Herbal Shampoo": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=60",
  "Moisturizing Soap": "https://images.unsplash.com/photo-1607006342465-5a87be7040f7?w=400&auto=format&fit=crop&q=60",
  "Fluoride Toothpaste": "https://images.unsplash.com/photo-1559591937-e620a01d6744?w=400&auto=format&fit=crop&q=60",
  "Deodorant Spray": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&auto=format&fit=crop&q=60",

  // Baby Care
  "Sensitive Baby Wipes": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&auto=format&fit=crop&q=60",
  "Ultra Comfort Diapers": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&auto=format&fit=crop&q=60",
  "Nourishing Baby Lotion": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&auto=format&fit=crop&q=60",
  "Organic Baby Food": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&auto=format&fit=crop&q=60",

  // Health Products
  "Multivitamin Tablets": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=60",
  "First Aid Bandages": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&auto=format&fit=crop&q=60",
  "Pure Hand Sanitizer": "https://images.unsplash.com/photo-1584515901387-a7575d4d7013?w=400&auto=format&fit=crop&q=60",
  "Digital Thermometer": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=60"
};

const defaultImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60";

// Standard brand names
const brandsMap = {
  "Groceries": ["Nature's Gift", "Anand Premium", "Tata Sampann", "Fortune"],
  "Dairy": ["Amul", "Mother Dairy", "Britannia", "Nestle"],
  "Bakery": ["Anand Bakery", "Modern", "Harvest Gold", "Britannia"],
  "Beverages": ["Red Label", "Nescafe", "Coca Cola", "Real", "Paper Boat"],
  "Frozen Foods": ["McCain", "Yummiez", "Safal", "Kwality Walls"],
  "Snacks": ["Haldiram's", "Lays", "Kurkure", "Cadbury", "Oreo"],
  "Household": ["Surf Excel", "Vim", "Dettol", "Lizol", "Odonil"],
  "Personal Care": ["Dove", "Colgate", "Pears", "Nivea", "Himalaya"],
  "Baby Care": ["Pampers", "Johnson's", "Himalaya Baby", "MamyPoko"],
  "Health Products": ["Revital", "Dettol", "Band-Aid", "Himalaya", "Cinthol"]
};

// standard suppliers
const suppliersMap = {
  "Groceries": "Global Agro Traders",
  "Dairy": "Anand Cooperative Dairy Association",
  "Bakery": "Anand Fresh Bake Ltd",
  "Beverages": "Beverage World Corp",
  "Frozen Foods": "ColdChain Logistics",
  "Snacks": "SuperSnack Distributors",
  "Household": "CleanCorp Wholesale",
  "Personal Care": "Beauty & Health Wholesale",
  "Baby Care": "Infant Care Distributors",
  "Health Products": "MedLife Pharma Distributors"
};

// Specific products metadata by category
const productsSchema = {
  "Groceries": [
    { name: "Rice", basePrice: 90, discount: 10, special: true },
    { name: "Sugar", basePrice: 42, discount: 5, special: true },
    { name: "Cooking Oil", basePrice: 165, discount: 12, special: true },
    { name: "Salt", basePrice: 28, discount: 0, special: true },
    { name: "Wheat Flour", basePrice: 55, discount: 8 },
    { name: "Red Lentils", basePrice: 120, discount: 15 },
    { name: "Organic Honey", basePrice: 240, discount: 20 },
    { name: "Mixed Spices", basePrice: 85, discount: 5 },
    { name: "Basmati Rice", basePrice: 150, discount: 10 },
    { name: "Gram Flour", basePrice: 65, discount: 5 }
  ],
  "Dairy": [
    { name: "Milk", basePrice: 32, discount: 0, special: true },
    { name: "Salted Butter", basePrice: 56, discount: 4 },
    { name: "Cheddar Cheese", basePrice: 140, discount: 10 },
    { name: "Greek Yogurt", basePrice: 45, discount: 8 },
    { name: "Fresh Paneer", basePrice: 95, discount: 5 },
    { name: "Whipping Cream", basePrice: 110, discount: 6 },
    { name: "Mozzarella Cheese", basePrice: 160, discount: 12 },
    { name: "Flavored Milk", basePrice: 35, discount: 5 },
    { name: "Buttermilk", basePrice: 15, discount: 0 },
    { name: "Margarine", basePrice: 50, discount: 8 }
  ],
  "Bakery": [
    { name: "Bread", basePrice: 40, discount: 5, special: true },
    { name: "Chocolate Chip Cookies", basePrice: 80, discount: 15 },
    { name: "Blueberry Muffins", basePrice: 120, discount: 10 },
    { name: "Butter Croissants", basePrice: 90, discount: 12 },
    { name: "Burger Buns", basePrice: 35, discount: 0 },
    { name: "Fruit Cake", basePrice: 250, discount: 10 },
    { name: "Tortilla Wraps", basePrice: 75, discount: 5 },
    { name: "Cream Donuts", basePrice: 60, discount: 15 },
    { name: "Garlic Bread", basePrice: 85, discount: 8 },
    { name: "Puff Pastry", basePrice: 45, discount: 5 }
  ],
  "Beverages": [
    { name: "Tea Powder", basePrice: 140, discount: 10, special: true },
    { name: "Roasted Coffee Beans", basePrice: 450, discount: 15 },
    { name: "Orange Juice", basePrice: 110, discount: 20 },
    { name: "Soda Cans (Pack of 6)", basePrice: 180, discount: 10 },
    { name: "Energy Drink", basePrice: 120, discount: 5 },
    { name: "Green Tea Bags", basePrice: 195, discount: 15 },
    { name: "Sparkling Water", basePrice: 60, discount: 8 },
    { name: "Coconut Water", basePrice: 50, discount: 0 },
    { name: "Tomato Juice", basePrice: 95, discount: 10 },
    { name: "Iced Tea Mix", basePrice: 130, discount: 12 }
  ],
  "Frozen Foods": [
    { name: "Frozen French Fries", basePrice: 115, discount: 10 },
    { name: "Vanilla Ice Cream", basePrice: 220, discount: 15 },
    { name: "Frozen Green Peas", basePrice: 85, discount: 8 },
    { name: "Veg Spring Rolls", basePrice: 140, discount: 12 },
    { name: "Frozen Pizza", basePrice: 199, discount: 20 },
    { name: "Frozen Sweet Corn", basePrice: 75, discount: 5 },
    { name: "Hash Browns", basePrice: 130, discount: 10 },
    { name: "Frozen Mixed Berries", basePrice: 350, discount: 18 },
    { name: "Frozen Vegetable Dumplings", basePrice: 160, discount: 10 },
    { name: "Ice Cream Sandwich", basePrice: 40, discount: 0 }
  ],
  "Snacks": [
    { name: "Biscuits", basePrice: 30, discount: 5, special: true },
    { name: "Potato Chips", basePrice: 20, discount: 0 },
    { name: "Cheese Popcorn", basePrice: 65, discount: 10 },
    { name: "Salted Peanuts", basePrice: 90, discount: 8 },
    { name: "Dark Chocolate Bar", basePrice: 150, discount: 15 },
    { name: "Corn Nachos", basePrice: 85, discount: 10 },
    { name: "Granola Bars (Pack of 5)", basePrice: 175, discount: 12 },
    { name: "Gummy Bears", basePrice: 50, discount: 5 },
    { name: "Rice Cakes", basePrice: 120, discount: 8 },
    { name: "Roasted Almonds", basePrice: 380, discount: 10 }
  ],
  "Household": [
    { name: "Laundry Detergent", basePrice: 299, discount: 15 },
    { name: "Dishwashing Liquid", basePrice: 99, discount: 8 },
    { name: "Garbage Bags (30pc)", basePrice: 120, discount: 10 },
    { name: "Paper Towels (Pack of 4)", basePrice: 150, discount: 12 },
    { name: "Glass Cleaner Spray", basePrice: 85, discount: 5 },
    { name: "Air Freshener", basePrice: 145, discount: 15 },
    { name: "Aluminium Foil", basePrice: 110, discount: 8 },
    { name: "Cleaning Sponge (Pack of 3)", basePrice: 60, discount: 0 },
    { name: "Toilet Cleaner", basePrice: 95, discount: 10 },
    { name: "Fabric Softener", basePrice: 220, discount: 12 }
  ],
  "Personal Care": [
    { name: "Herbal Shampoo", basePrice: 180, discount: 15 },
    { name: "Moisturizing Soap (Pack of 3)", basePrice: 110, discount: 8 },
    { name: "Fluoride Toothpaste", basePrice: 85, discount: 5 },
    { name: "Deodorant Spray", basePrice: 210, discount: 20 },
    { name: "Hand Sanitizer (500ml)", basePrice: 150, discount: 10 },
    { name: "Body Wash", basePrice: 240, discount: 15 },
    { name: "Mouthwash", basePrice: 135, discount: 10 },
    { name: "Face Wash", basePrice: 160, discount: 12 },
    { name: "Shaving Cream", basePrice: 90, discount: 8 },
    { name: "Toothbrush (Soft)", basePrice: 45, discount: 0 }
  ],
  "Baby Care": [
    { name: "Sensitive Baby Wipes", basePrice: 199, discount: 10 },
    { name: "Ultra Comfort Diapers", basePrice: 699, discount: 15 },
    { name: "Nourishing Baby Lotion", basePrice: 250, discount: 12 },
    { name: "Organic Baby Food", basePrice: 180, discount: 8 },
    { name: "Baby Powder", basePrice: 140, discount: 5 },
    { name: "Gentle Baby Shampoo", basePrice: 210, discount: 10 },
    { name: "Silicone Pacifier", basePrice: 120, discount: 0 },
    { name: "Baby Body Wash", basePrice: 280, discount: 15 },
    { name: "Cotton Buds for Babies", basePrice: 65, discount: 5 },
    { name: "Teething Ring", basePrice: 95, discount: 8 }
  ],
  "Health Products": [
    { name: "Multivitamin Tablets", basePrice: 499, discount: 12 },
    { name: "First Aid Bandages", basePrice: 50, discount: 0 },
    { name: "Pure Hand Sanitizer", basePrice: 99, discount: 5 },
    { name: "Digital Thermometer", basePrice: 299, discount: 10 },
    { name: "Vitamin C Chews", basePrice: 150, discount: 8 },
    { name: "Pain Relieving Gel", basePrice: 120, discount: 5 },
    { name: "Cough Drops", basePrice: 40, discount: 0 },
    { name: "Whey Protein (1kg)", basePrice: 2499, discount: 15 },
    { name: "Honey Lozenges", basePrice: 85, discount: 5 },
    { name: "Medical Face Masks (50pc)", basePrice: 199, discount: 20 }
  ]
};

// Helper to pad numbers
const pad = (num, size) => {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

// Generate 100 realistic products
export const generateProducts = () => {
  const list = [];
  let idCounter = 1;

  categories.forEach((category) => {
    const items = productsSchema[category] || [];
    const brands = brandsMap[category];
    const supplier = suppliersMap[category];

    items.forEach((item, index) => {
      const barcodePrefix = "8901058";
      const barcodeSuffix = pad(idCounter * 123 + 4567, 6);
      const barcode = barcodePrefix + barcodeSuffix;

      const skuPrefix = category.slice(0, 3).toUpperCase();
      const skuSuffix = pad(idCounter, 3);
      const sku = `${skuPrefix}-${item.name.replace(/\s+/g, "").slice(0, 3).toUpperCase()}-${skuSuffix}`;

      // GST defaults based on category
      let gst = 18;
      if (category === "Groceries") gst = 5;
      else if (category === "Dairy" || category === "Bakery") gst = 5;
      else if (category === "Health Products") gst = 12;

      // Selling Price (MRP)
      const sellingPrice = item.basePrice;
      // Cost price is typically 65% - 80% of selling price
      const costPercent = 0.7 + (Math.random() * 0.1);
      const costPrice = Math.round(sellingPrice * costPercent * 100) / 100;

      // Inventory parameters
      // Low stock / Out of stock simulation
      // We will make 3 products out of stock, 8 products low stock, and the rest healthy
      let quantity = Math.floor(Math.random() * 80) + 20;
      const reorderPoint = 15;

      if (idCounter === 3 || idCounter === 17 || idCounter === 55) {
        quantity = 0; // Out of stock
      } else if (idCounter === 7 || idCounter === 12 || idCounter === 29 || idCounter === 44 || idCounter === 67 || idCounter === 81) {
        quantity = Math.floor(Math.random() * reorderPoint); // Low stock
      }

      // Expiry dates: fresh products expire sooner, household/packaged later
      let monthsToExpiry = Math.floor(Math.random() * 18) + 6;
      if (category === "Dairy" || category === "Bakery") {
        monthsToExpiry = Math.floor(Math.random() * 3) + 1; // 1 to 3 months
      }
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + monthsToExpiry);
      const expiryDate = expiry.toISOString().split("T")[0];

      // Warehouse Location
      const aisMap = {
        "Groceries": "Aisle A",
        "Dairy": "Cooler Area C-1",
        "Bakery": "Aisle B-Fresh",
        "Beverages": "Beverage Rack R-2",
        "Frozen Foods": "Freezer Section F-3",
        "Snacks": "Aisle S-4",
        "Household": "Aisle H-6",
        "Personal Care": "Aisle P-7",
        "Baby Care": "Aisle K-8",
        "Health Products": "Pharmacy Counter PH-1"
      };
      const location = `${aisMap[category]}-${Math.floor(Math.random() * 5) + 1}`;

      // Brand selection
      const brand = brands[index % brands.length];

      // Image selection
      const imgUrl = imagesMap[item.name] || defaultImage;

      // Rating
      const rating = parseFloat((4.0 + Math.random() * 0.9).toFixed(1));

      // Fast moving badges (arbitrary but consistent)
      const isFastMoving = item.special || (idCounter % 9 === 0);

      list.push({
        id: idCounter,
        sku,
        barcode,
        qrCode: `https://instabill.pro/verify/${sku}`,
        name: item.name,
        category,
        brand,
        supplier,
        costPrice,
        sellingPrice,
        discount: item.discount,
        gst,
        quantity,
        reorderPoint,
        expiryDate,
        batchNumber: `BAT-${expiry.getFullYear()}-${pad(expiry.getMonth() + 1, 2)}`,
        warehouseLocation: location,
        rating,
        image: imgUrl,
        fastMoving: isFastMoving,
        lowStock: quantity <= reorderPoint && quantity > 0,
        outOfStock: quantity === 0
      });

      idCounter++;
    });
  });

  return list;
};
