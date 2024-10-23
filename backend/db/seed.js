const client = require("./client.js");
const { createUser } = require("./users/users.js");
const { createCategory } = require("./categories/categories.js");
const { createProduct } = require("./products/products.js");
const { createOrder } = require("./orders/orders.js");
const { createCart } = require("./cart/cart.js");

const dropTables = async () => {
  try {
    console.log("DROPPING TABLES");
    await client.query(`DROP TABLE IF EXISTS cart;`);
    await client.query(`DROP TABLE IF EXISTS orders;`);
    await client.query(`DROP TABLE IF EXISTS products;`);
    await client.query(`DROP TABLE IF EXISTS categories;`);
    await client.query(`DROP TABLE IF EXISTS users;`);
    console.log("TABLES DROPPED SUCCESSFULLY");
  } catch (error) {
    console.error("ERROR DROPPING TABLES: ", error);
  }
};

const createTables = async () => {
  try {
    console.log("CREATING TABLES");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        price FLOAT NOT NULL,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount FLOAT NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE cart (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        PRIMARY KEY (user_id, product_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("TABLES CREATED SUCCESSFULLY");
  } catch (error) {
    console.error("ERROR CREATING TABLES: ", error);
  }
};

const init = async () => {
  try {
    await client.connect();
    console.log("Successfully connected to database.");

    await dropTables();
    await createTables();
    await createUser("user01", "pass1234!", "user01@example.com");
    await createUser("john_doe", "password123", "john@example.com");
    await createUser("jane.smith", "securePass456", "jane@example.com");
    await createUser("alice_wonderland", "alice@wonderland", "alice@example.com");
    await createUser("bob_builder", "bobsPassword789", "bob@example.com");
    await createUser("charlie.brown", "peanuts123", "charlie@example.com");
    await createUser("david.jones", "david@2024", "david@example.com");
    await createUser("eve_online", "Eve@Secure!", "eve@example.com");
    await createUser("frank_furter", "rockyHorror!", "frank@example.com");
    await createUser("george.washington", "firstpresident1776", "george@example.com");
    await createUser("hannah_montana", "bestofbothworlds", "hannah@example.com");
    await createUser("ian.malcolm", "lifeFindsAWay", "ian@example.com");
    await createUser("julia_child", "bonappetit2024", "julia@example.com");
    await createUser("kevin_spacey", "houseofcards123", "kevin@example.com");
    await createUser("lisa.simpson", "notebook@2024", "lisa@example.com");
    await createUser("mike_tyson", "baddestman@1992", "mike@example.com");
    await createUser("nina_simon", "feelinggood2024", "nina@example.com");
    await createUser("oliver_twist", "pleaseSir2024", "oliver@example.com");
    await createUser("paul_atreides", "chosenone2024", "paul@example.com");
    await createUser("quinn.snyder", "basketball123", "quinn@example.com");
    await createUser("rachel_green", "fashionista2024", "rachel@example.com");
    await createUser("sam_wilson", "falcon@2024", "sam@example.com");
    await createUser("tina.fey", "30rock2024", "tina@example.com");
    await createUser("uma_thurman", "pulpfiction2024", "uma@example.com");
    await createUser("victor_frankenstein", "monster2024", "victor@example.com");
    await createUser("will_smith", "freshprince2024", "will@example.com");
    await createUser("xena_warrior", "stronghero2024", "xena@example.com");
    await createUser("yoda.master", "jedi2024", "yoda@example.com");
    await createUser("zara_fair", "fashion2024", "zara@example.com");
    await createUser("aaron_patterson", "runaway2024", "aaron@example.com");
    await createUser("brittany_spears", "oops2024", "brittany@example.com");
    await createUser("chris_evans", "captain@2024", "chris@example.com");
    await createUser("debbie_harry", "blondie2024", "debbie@example.com");
    await createUser("ed_sheeran", "shapeofyou2024", "ed@example.com");
    await createUser("fiona_gubelmann", "actor2024", "fiona@example.com");
    await createUser("gregory_house", "diagnosis@2024", "gregory@example.com");
    await createUser("hayley_williams", "paramore2024", "hayley@example.com");
    await createUser("isabelle_huppert", "cinema2024", "isabelle@example.com");
    await createUser("jack_sparrow", "pirate2024", "jack@example.com");
    await createUser("keira_knightley", "pirates@2024", "keira@example.com");
    await createUser("loki_odinson", "godofmischief2024", "loki@example.com");
    await createUser("meryl_streep", "legendary@2024", "meryl@example.com");
    await createUser("nicolas_cage", "nationaltreasure2024", "nicolas@example.com");
    await createUser("oprah_winfrey", "inspiration2024", "oprah@example.com");
    await createUser("peter_parker", "spiderman2024", "peter@example.com");
    await createUser("quincy_jones", "musiclegend2024", "quincy@example.com");
    await createUser("rihanna", "music@2024", "rihanna@example.com");
    await createUser("sophia_loren", "cinemaqueen2024", "sophia@example.com");
    await createUser("tony_stark", "ironman2024", "tony@example.com");
    await createUser("uma_thurman", "killbill2024", "uma@example.com");
    await createUser("victoria_beckham", "spicegirl2024", "victoria@example.com");
    
    await createCategory("guitar");
    await createCategory("drums"); 
    await createCategory("piano");
    await createCategory("bass"); 
    
    await createProduct(
      "Red & White Electric Guitar",
      "EART red and white electric guitar.",
      119.99,
      1,
      "https://m.media-amazon.com/images/I/51lMkclcy4L.jpg"
    );
    await createProduct(
      "Blue & Black Electric Guitar",
      "CS series dark blue electric guitar.",
      199.99,
      1,
      "https://www.lyxpro.com/cdn/shop/files/LYXEGST39BL-Strat-Guitar-Blue-Product-Image-2.jpg?v=1684763288&width=1946"
    );
    await createProduct(
      "Black & White Electric Guitar",
      "LA black and white electric guitar.",
      134.99,
      1,
      "https://media.hearstapps.com/vader-prod.s3.amazonaws.com/1646350425-31KPaXe9JL._SL500_.jpg?width=600"
    );
    await createProduct(
      "Black & Brown Electric Guitar",
      "Fender electric guitar.",
      179.99,
      1,
      "https://m.media-amazon.com/images/I/61Z01+68f8L.jpg"
    );
    await createProduct(
      "Black & Blue Lightning Electric Guitar Starter Kit",
      "Electric guitar starter kit.",
      159.99,
      1,
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHZXopRTrDA38PeWN8qVn3Q0g0X8MoyF45XQ&s"
    );

    await createProduct(
      "Yamaha F325D Acoustic Guitar",
      "Yamaha F325D acoustic guitar.",
      139.99,
      1,
     "https://m.media-amazon.com/images/I/61RLzFHpZNL.jpg"
    );
    await createProduct(
      "Yamaha FG800 Acoustic Guitar",
      "Yamaha FG800 acoustic guitar.",
      129.99,
      1,
      "https://m.media-amazon.com/images/I/61ND88VcoaL._AC_UF894,1000_QL80_.jpg"
    );
    await createProduct(
      "Gibson Acoustic Guitar",
      "Gibson acoustic guitar.",
      219.99,
      1,
      "https://guitarfactory.net/cdn/shop/collections/Menu-Guitars-Acoustic-004.jpg?v=1711515615"
    );
    await createProduct(
      "Black acoustic guitar",
      "Black acoustic guitar.",
      99.99,
      1,
      "https://media.musiciansfriend.com/is/image/MMGS7/Special-X-Style-000-Cutaway-Acoustic-Electric-Guitar-Black/L66003000001000-00-500x500.jpg"
    );
    await createProduct(
      "acoustic guitar",
      "Fender acoustic guitar.",
      149.99,
      1,
      "https://guildguitars.com/wp-content/uploads/2023/05/Featured-F-40-Standard-Pacific-Sunset-Burst-845x321.jpg"
    );

    await createProduct(
      "drums",
      "Gammon blue drums.",
      199.99,
      2,
      "https://m.media-amazon.com/images/I/71HQVdUysqL.jpg"
    );
    await createProduct(
      "drums",
      "Shuntian red drums.",
      899.99,
      2,
      "https://m.media-amazon.com/images/I/61ypoVoFCLL._AC_UF894,1000_QL80_.jpg"
    );
    await createProduct(
      "drums",
      "Yamaha black drums .",
      789.99,
      2,
      "https://www.yamaha.com/yamahavgn/PIM/Images/19033_12073_1_1200x1200_58b52730f684c183775385a3b54a107e.jpg"
    );
    await createProduct(
      "drums",
      "DW drums .",
      1149.99,
      2,
      "https://www.dwdrums.com/_next/image/?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F165398%2F1644x1644%2F485816fa8e%2Fdw_key_image_drumsets_1644x1644.png&w=3840&q=75"
    );
    await createProduct(
      "drums",
      "Roland electric drums.",
      1299.99,
      2,
      "https://cdn11.bigcommerce.com/s-gs0pdv/images/stencil/original/products/18040/87532/vad507_front_gal__68137.1673015344.jpg?c=2&imbypass=on&imbypass=on"
    );
    await createProduct(
      "drums",
      "PDP drums.",
      999.99,
      2,
      "https://a.storyblok.com/f/165398/1644x1644/a609ae33dd/pdp_key_drums_1644x1644_stripes.png"
    );
    await createProduct(
      "drums",
      "DW wood drums.",
      789.99,
      2,
      "https://www.dwdrums.com/_next/image/?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F165398%2F1644x1644%2F4ed13934c1%2Fdw_key_drumrug_1644x1644.png&w=3840&q=75"
    );
    await createProduct(
      "drums",
      "Ludwig drums.",
      849.99,
      2,
      "https://www.ludwig-drums.com/application/files/6516/7995/1133/evolution-fab-thumb.jpg"
    );
    await createProduct(
      "drums",
      "Mapex drums.",
      649.99,
      2,
      "https://mapexdrums.com/files/file_pool/1/0m347634800469870651/pro_list_dk_ve5294ftcvh.jpg"
    );
    await createProduct(
      "drums",
      "Donner kids drums.",
      299.99,
      2,
      "https://i5.walmartimages.com/seo/Donner-Kids-Size-Drums-Sets-14-5-Piece-Complete-Drum-Kit-for-Child-Beginners-Percussion-Musical-Toy-Metallic-Blue_53d7009d-f477-45b4-91d9-5fcd922a0d02.8499e94523a252a64b6933e66b69a7a8.jpeg"
    );

    await createProduct(
      "piano",
      "Yamaha classic piano.",
      699.99,
      3,
      "https://pianopiano.com/wp-content/uploads/2018/12/yamaha-5-7-grand-piano-1.jpg"
    );
    await createProduct(
      "piano",
      "Yamaha piano.",
      479.99,
      3,
      "https://www.musiccitypianos.com/information/images/types-of-pianos/YUS5_PE%20T.png"
    );
    await createProduct(
      "piano",
      "Digital piano.",
      199.99,
      3,
      "https://m.media-amazon.com/images/I/71z7svZWSFL.jpg"
    );
    await createProduct(
      "piano",
      "Clavinova piano.",
      849.99,
      3,
      "https://europe.yamaha.com/en/files/CVP-909GP_a_0001_a37e118b8f5eaff304ddbda0af3ac7e2.jpg?impolicy=resize&imwid=396&imhei=396"
    );
    await createProduct(
      "piano",
      "Yamaha CLP piano.",
      789.99,
      3,
      "https://www.nantelmusique.ca/wp-content/uploads/2020/12/Yamaha-CLP765GP.jpg.webp"
    );
    await createProduct(
      "piano",
      "Kawai EX piano.",
      1049.99,
      3,
      "https://cdn11.bigcommerce.com/s-rjo23zgaad/images/stencil/original/products/207/451/Kawai-SK-EX__05857.1620353968.jpg?c=1"
    );
    await createProduct(
      "piano",
      "Starfavor digital piano.",
      199.99,
      3,
      "https://m.media-amazon.com/images/I/71FobkNjTZL.jpg"
    );
    await createProduct(
      "piano",
      "Yamaha aruis digital piano.",
      349.99,
      3,
      "https://www.yamaha.com/yamahavgn/PIM/Images/YDP-145B_a_0001_a91446934e2022e1d4b89d1b76fe8697.jpg"
    );
    await createProduct(
      "piano",
      "Kawai digital piano.",
      219.99,
      3,
      "https://kawaius.com/wp-content/uploads/2018/10/CA98-Digital-Piano-Polished-Ebony-450x450.jpg"
    );
    await createProduct(
      "piano",
      "Yamaha DGX digital piano.",
      299.99,
      3,
      "https://www.yamaha.com/yamahavgn/PIM/Images/DGX-670B-f-0001_deb7a4ab696380dc3e66f6422d907bba.jpg"
    );

    await createProduct(
      "bass",
      "Ktaxon 4 string bass.",
      79.99,
      4,
      "https://m.media-amazon.com/images/I/513EtuMMvGL._AC_UF894,1000_QL80_.jpg"
    );
    await createProduct(
      "bass",
      "Vintage VJ75 bass.",
      99.99,
      4,
      "https://vintageguitarsrus.com/cdn/shop/products/VJ75MSSB_72e1c09c-5a12-4881-a3a8-e4e248bc463e.jpg?v=1643978362"
    );
    await createProduct(
      "bass",
      "Yamaha red bass.",
      149.99,
      4,
      "https://usa.yamaha.com/files/image-index-new_0e7d561e5d48cf5872d1aefdc621a61d.jpg?impolicy=resize&imwid=396&imhei=396"
    );
    await createProduct(
      "bass",
      "LA 5 string bass.",
      129.99,
      4,
      "https://r2.gear4music.com/media/38/384284/600/preview_1.jpg"
    );
    await createProduct(
      "bass",
      "Xian blue bass.",
      249.99,
      4,
      "https://m.media-amazon.com/images/I/410baE20V+L.jpg"
    );
    await createProduct(
      "bass",
      "Fender blue bass.",
      369.99,
      4,
      "https://media.musiciansfriend.com/is/image/MMGS7/Player-Jazz-Bass-Plus-Top-Limited-Edition-Bass-Guitar-Blue-Burst/L75293000001000-00-500x500.jpg"
    );
    await createProduct(
      "bass",
      "Ibanez black bass.",
      299.99,
      4,
      "https://www.musicworks.co.nz/content/products/ibanez-srms5-wk-prestige-5-string-bass-guitar-multi-scale-weathered-black-1-srms5wk.jpg?canvas=1:1&width=2500"
    );
    await createProduct(
      "bass",
      "Ibanez red bass.",
      229.99,
      4,
      "https://media.sweetwater.com/m/products/image/dba4f26248Mx4Rm5Dp8NHsIYZLPOaHMqoNvWHg8W.png?quality=82&height=750&ha=dba4f26248d74908"
    );
    await createProduct(
      "bass",
      "Fender bass.",
      109.99,
      4,
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUFNxS_KYRmsROiSPm1yhjedVOWzkK8N2ZLQ&s"
    );
    await createProduct(
      "bass",
      "Yamaha white bass.",
      179.99,
      4,
      "https://images.unsplash.com/photo-1485278537138-4e8911a13c02?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFzcyUyMGd1aXRhcnxlbnwwfHwwfHx8MA%3D%3D"
    );

    await createOrder(1, 50.13, "shipped");
    await createCart(1, 1, 4);
  } catch (error) {
    console.error("ERROR CONNECTING TO DATABASE: ", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

init();
