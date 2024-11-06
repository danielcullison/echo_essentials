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
        role VARCHAR(20) DEFAULT 'user',
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
    await createUser("admin", "admin123", "admin123@example.comm", "admin");
    await createUser("john_doe", "password123", "john@example.com", "user");
    await createUser("jane.smith", "securePass456", "jane@example.com", "user");
    await createUser(
      "alice_wonderland",
      "alice@wonderland",
      "alice@example.com",
      "user"
    );
    await createUser(
      "bob_builder",
      "bobsPassword789",
      "bob@example.com",
      "user"
    );
    await createUser(
      "charlie.brown",
      "peanuts123",
      "charlie@example.com",
      "user"
    );
    await createUser("david.jones", "david@2024", "david@example.com", "user");
    await createUser("eve_online", "Eve@Secure!", "eve@example.com", "user");
    await createUser(
      "frank_furter",
      "rockyHorror!",
      "frank@example.com",
      "user"
    );
    await createUser(
      "george.washington",
      "firstpresident1776",
      "george@example.com",
      "user"
    );
    await createUser(
      "hannah_montana",
      "bestofbothworlds",
      "hannah@example.com",
      "user"
    );
    await createUser("ian.malcolm", "lifeFindsAWay", "ian@example.com", "user");
    await createUser(
      "julia_child",
      "bonappetit2024",
      "julia@example.com",
      "user"
    );
    await createUser(
      "kevin_spacey",
      "houseofcards123",
      "kevin@example.com",
      "user"
    );
    await createUser(
      "lisa.simpson",
      "notebook@2024",
      "lisa@example.com",
      "user"
    );
    await createUser(
      "mike_tyson",
      "baddestman@1992",
      "mike@example.com",
      "user"
    );
    await createUser(
      "nina_simon",
      "feelinggood2024",
      "nina@example.com",
      "user"
    );
    await createUser(
      "oliver_twist",
      "pleaseSir2024",
      "oliver@example.com",
      "user"
    );
    await createUser(
      "paul_atreides",
      "chosenone2024",
      "paul@example.com",
      "user"
    );
    await createUser(
      "quinn.snyder",
      "basketball123",
      "quinn@example.com",
      "user"
    );
    await createUser(
      "rachel_green",
      "fashionista2024",
      "rachel@example.com",
      "user"
    );
    await createUser("sam_wilson", "falcon@2024", "sam@example.com", "user");
    await createUser("tina.fey", "30rock2024", "tina@example.com", "user");
    await createUser(
      "uma_thurman",
      "pulpfiction2024",
      "uma@example.com",
      "user"
    );
    await createUser(
      "victor_frankenstein",
      "monster2024",
      "victor@example.com",
      "user"
    );
    await createUser(
      "will_smith",
      "freshprince2024",
      "will@example.com",
      "user"
    );
    await createUser(
      "xena_warrior",
      "stronghero2024",
      "xena@example.com",
      "user"
    );
    await createUser("yoda.master", "jedi2024", "yoda@example.com", "user");
    await createUser("zara_fair", "fashion2024", "zara@example.com", "user");
    await createUser(
      "aaron_patterson",
      "runaway2024",
      "aaron@example.com",
      "user"
    );
    await createUser(
      "brittany_spears",
      "oops2024",
      "brittany@example.com",
      "user"
    );
    await createUser(
      "chris_evans",
      "captain@2024",
      "chris@example.com",
      "user"
    );
    await createUser(
      "debbie_harry",
      "blondie2024",
      "debbie@example.com",
      "user"
    );
    await createUser("ed_sheeran", "shapeofyou2024", "ed@example.com", "user");
    await createUser(
      "fiona_gubelmann",
      "actor2024",
      "fiona@example.com",
      "user"
    );
    await createUser(
      "gregory_house",
      "diagnosis@2024",
      "gregory@example.com",
      "user"
    );
    await createUser(
      "hayley_williams",
      "paramore2024",
      "hayley@example.com",
      "user"
    );
    await createUser(
      "isabelle_huppert",
      "cinema2024",
      "isabelle@example.com",
      "user"
    );
    await createUser("jack_sparrow", "pirate2024", "jack@example.com", "user");
    await createUser(
      "keira_knightley",
      "pirates@2024",
      "keira@example.com",
      "user"
    );
    await createUser(
      "loki_odinson",
      "godofmischief2024",
      "loki@example.com",
      "user"
    );
    await createUser(
      "meryl_streep",
      "legendary@2024",
      "meryl@example.com",
      "user"
    );
    await createUser(
      "nicolas_cage",
      "nationaltreasure2024",
      "nicolas@example.com",
      "user"
    );
    await createUser(
      "oprah_winfrey",
      "inspiration2024",
      "oprah@example.com",
      "user"
    );
    await createUser(
      "peter_parker",
      "spiderman2024",
      "peter@example.com",
      "user"
    );
    await createUser(
      "quincy_jones",
      "musiclegend2024",
      "quincy@example.com",
      "user"
    );
    await createUser("rihanna", "music@2024", "rihanna@example.com", "user");
    await createUser(
      "sophia_loren",
      "cinemaqueen2024",
      "sophia@example.com",
      "user"
    );
    await createUser("tony_stark", "ironman2024", "tony@example.com", "user");
    await createUser(
      "victoria_beckham",
      "spicegirl2024",
      "victoria@example.com",
      "user"
    );
    await createUser("test1", "test1", "test1@example.com", "user");

    console.log("USERS CREATED SUCCESSFULLY");

    await createCategory("guitar");
    await createCategory("drums");
    await createCategory("piano");

    await createProduct(
      "EART Electric Guitar",
      "The guitar features a roasted maple neck for stability and a stunning caramel finish, paired with a roasted mahogany body that enhances midrange tones and reduces weight. It includes a bone nut for improved sustain and lubrication, while hand-polished stainless steel frets offer durability and a smooth playing experience. The U to C compound neck profile and a compound radius of 7.25” to 9.5” provide excellent playability for both chords and solos.",
      214.99,
      1,
      "https://m.media-amazon.com/images/I/51lMkclcy4L.jpg"
    );
    await createProduct(
      "LyxPro Electric Guitar",
      "The LyxPro 39 in. Electric Guitar is designed for aspiring musicians seeking both style and performance. Its sleek body shape offers a comfortable grip, while the vibrant finish enhances its visual appeal. Equipped with dual humbucker pickups, this guitar delivers a rich, full sound perfect for various genres. The smooth maple neck and rosewood fingerboard provide excellent playability, allowing for effortless chords and solos. Lightweight and portable, the LyxPro is an ideal choice for both practice sessions and performances.",
      99.99,
      1,
      "https://www.lyxpro.com/cdn/shop/files/LYXEGST39BL-Strat-Guitar-Blue-Product-Image-2.jpg?v=1684763288&width=1946"
    );
    await createProduct(
      "Fender Stratocaster Electric Guitar",
      "The Squier® Affinity Series™ Stratocaster® is a fantastic entry point into the legendary Fender® family, offering iconic design and classic tone for today's aspiring guitarists. This model features several player-friendly enhancements, including a lightweight body and a slim C-shaped neck profile for added comfort. Its 2-point tremolo bridge ensures excellent tremolo action, while sealed die-cast tuning machines with split shafts provide smooth, precise tuning and effortless restringing. Equipped with three Squier single-coil Strat pickups and a 5-way switch, this guitar is versatile enough to suit any genre, making it perfect for players at any level.",
      249.99,
      1,
      "https://m.media-amazon.com/images/I/61Z01+68f8L.jpg"
    );

    await createProduct(
      "Yamaha F325D Acoustic Guitar",
      "This beautifully crafted acoustic guitar offers exceptional sound quality and effortless playability. Featuring a classic dreadnought body shape, it delivers powerful resonance and projection. The spruce top enhances tonal clarity and brightness, while the rosewood fingerboard provides a smooth and comfortable playing surface. Perfect for musicians of all levels, this guitar combines quality construction with an inviting feel.",
      199.99,
      1,
      "https://m.media-amazon.com/images/I/61RLzFHpZNL.jpg"
    );
    await createProduct(
      "Gammon Blue Drums",
      "Introducing the complete 5-piece junior drum set, the perfect kit for children ages 3-12 years old. Ideal for aspiring drummers, this set caters to beginners, intermediate, and advanced players looking to develop their skills. The drum set includes a 16 in. bass drum, snare drum, two mounted toms, a floor tom, hi-hat cymbals, and a crash cymbal, along with essential accessories like a snare stand, hi-hat stand, padded throne, and a pair of drumsticks—everything needed to start drumming right away!",
      199.99,
      2,
      "https://m.media-amazon.com/images/I/71HQVdUysqL.jpg"
    );
    await createProduct(
      "Shuntian Red Drums",
      "Discover the joy of music with this ideal first drum kit, designed specifically for beginners to enhance their skills while ensuring maximum fun for the whole family. Whether you're learning or jamming to classic tunes, this drum set is perfect for starting your musical journey.",
      959.99,
      2,
      "https://m.media-amazon.com/images/I/61ypoVoFCLL._AC_UF894,1000_QL80_.jpg"
    );
    await createProduct(
      "Yamaha Black Drums",
      "The Yamaha Stage Custom birch drum shell pack is perfect for both beginners and working professionals alike. Its staggered diagonal seam design enables the creation of a thin drum shell that maintains its shape over time. The low-mass lugs allow the shell to vibrate freely, resulting in exceptional tone and sustain. Additionally, Yamaha's Air Seal System guarantees that each drum shell has a uniform thickness and perfect roundness, contributing to superior tone quality and durability.",
      799.99,
      2,
      "https://www.yamaha.com/yamahavgn/PIM/Images/19033_12073_1_1200x1200_58b52730f684c183775385a3b54a107e.jpg"
    );
    await createProduct(
      "DW Black Drums",
      "The DW Performance Series features HVX maple shells that are meticulously hand-built in the same California facility by the same skilled craftsmen behind DW's renowned Collector's Series. The hardware provides many of the same tuning and performance benefits as its premium counterpart. With reduced Quarter Turret lugs and a variety of specialty wraps, lacquer, and satin finishes, the Performance Series boasts a unique character and charm all its own.",
      3344.99,
      2,
      "https://www.dwdrums.com/_next/image/?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F165398%2F1644x1644%2F485816fa8e%2Fdw_key_image_drumsets_1644x1644.png&w=3840&q=75"
    );
    await createProduct(
      "Roland Electric Drums",
      "The Roland VAD307 drum kit is designed to be compact while maintaining the distinctive V-Drums Acoustic Design aesthetic, with a footprint matching that of a mid-level V-Drums set, making it ideal for home use or small stages. Its cutdown shallow shells save space and weight but provide a familiar feel for drummers. The layout features double-braced stands with tom mounts and cymbal boom arms, enhancing the acoustic theme. The updated TD-17 module offers exceptional acoustic tone and playability, complete with more preset kits, expanded effects, and support for Roland Cloud. Additionally, the VAD307 includes thin crash and ride cymbals that deliver a natural feel and responsive motion, complemented by flagship-grade stands for reliable performance.",
      2499.99,
      2,
      "https://cdn11.bigcommerce.com/s-gs0pdv/images/stencil/original/products/18040/87532/vad507_front_gal__68137.1673015344.jpg?c=2&imbypass=on&imbypass=on"
    );
    await createProduct(
      "PDP Drums",
      "PDP Center Stage drum sets are an ideal choice for aspiring drummers. With multi-ply 100% poplar shells, these drums deliver a balanced tone and warm low end, helping beginners develop their skills. The snare and tom shells are equipped with DW's True-Pitch tension rods, providing 20% more threads per square inch for precise and stable tuning. The bass drum features telescoping spurs to prevent 'creep' during intense practice sessions. This set includes 7x10 in. and 8x12. mounted toms, a 14x16 in. floor tom, a 16x22 in. bass drum, and a 5x14 in. snare drum. It also comes with a cymbal pack featuring 13 in. hi-hats and a 15 in. crash-ride, along with a complete hardware pack, throne, and sticks.",
      599.99,
      2,
      "https://a.storyblok.com/f/165398/1644x1644/a609ae33dd/pdp_key_drums_1644x1644_stripes.png"
    );
    await createProduct(
      "Ludwig Drums",
      "Ludwig Element Evolution 6-piece drum set provides everything an aspiring drummer needs to thrive. This comprehensive kit includes double-braced hardware, renowned Remo Pinstripe drum heads, and Zildjian I Series hi-hat, crash, and ride cymbals, making it perfect for drummers of any age ready to advance in their musical journey. Featuring three of the most respected names in the industry, this versatile package is designed for success.",
      1099.99,
      2,
      "https://www.ludwig-drums.com/application/files/6516/7995/1133/evolution-fab-thumb.jpg"
    );
    await createProduct(
      "Mapex Drums",
      "The Saturn Series Rock Shell Pack SR529XU takes contemporary drum sound to new heights, featuring enhancements to the iconic hybrid Maple/Walnut shell and stunning lacquer finishes. Whether tuned high for jazz and fusion or low for rock 'n' roll, the Saturn shells with SONIClear bearing edges deliver clear and focused toms, along with a bass drum that has an impressive, robust sound.",
      1399.99,
      2,
      "https://mapexdrums.com/files/file_pool/1/0m347634800469870651/pro_list_dk_ve5294ftcvh.jpg"
    );
    await createProduct(
      "Donner Kid's Drums",
      "This perfect junior drum set is designed for children ages 5 to 12 and includes a 14 in x 10 in bass drum, two fixed toms, a fixed snare drum with stand, a 12 in floor tom, a hi-hat with stand, a straight cymbal with stand, and various drumsticks. Crafted from horizontal-grained poplar wood, the drums offer high strength, uniform vibration, and a loud sound, enhanced by a 6-ear structure for better skin tension. The set also comes with a sturdy bench capable of supporting up to 198 lbs (90 kg), making it ideal for parents or teachers to join in. While the kit requires some assembly for easy transport, detailed instructional videos make setup straightforward. With a 12-month warranty, customer support is readily available for any inquiries or additional installation information.",
      299.99,
      2,
      "https://i5.walmartimages.com/seo/Donner-Kids-Size-Drums-Sets-14-5-Piece-Complete-Drum-Kit-for-Child-Beginners-Percussion-Musical-Toy-Metallic-Blue_53d7009d-f477-45b4-91d9-5fcd922a0d02.8499e94523a252a64b6933e66b69a7a8.jpeg"
    );

    await createProduct(
      "Yamaha Grand Piano",
      "The Yamaha Clavinova CLP-895GP represents the pinnacle of the CLP series, combining luxury, cutting-edge Yamaha technology, and exceptional sound within a grand piano cabinet. It features GrandTouch Keyboard action and world-class Yamaha CFX and Bösendorfer Imperial piano voices. Available in polished ebony and polished white finishes, the CLP-895GP is the ideal choice for discerning musicians seeking both elegance and performance.",
      8999.99,
      3,
      "https://pianopiano.com/wp-content/uploads/2018/12/yamaha-5-7-grand-piano-1.jpg"
    );
    await createProduct(
      "Yamaha Upright Piano",
      "In addition to the Stream Lights and Smart Pianist app, the flagship Clavinova CSP showcases the CFX and Bösendorfer Imperial Concert Grand Piano voices. Its GrandTouch keys feature linear graded hammer action and counterweights, along with a GP Response Damper Pedal, providing an immersive playing experience enhanced by spatial Binaural Sampling. The inclusion of the Bidirectional Manifold Horn (BM Horn) projects sound in two directions, delivering a rich and powerful auditory experience from multiple angles.",
      7999.99,
      3,
      "https://www.musiccitypianos.com/information/images/types-of-pianos/YUS5_PE%20T.png"
    );
    await createProduct(
      "Digital Piano 88",
      "This set is the perfect digital piano for beginners, featuring 88 semi-weighted keys that simulate the authentic feel of an acoustic piano while offering a lighter touch for sensitive response. With 200 rhythms, 200 sounds, and 70 demo songs, this piano facilitates practicing chords and creating music, and it even allows Bluetooth connectivity for additional lessons via smartphone. Its strong functionality includes MIDI support for music editing and recording, along with connections for a sustain pedal, MP3 player, microphone, headphone, and USB. The kit is thoughtfully equipped with a sustain pedal, music rest, power adapter, and sturdy double-X stand, along with key stickers for simplified learning, making it an ideal package to kickstart your musical journey.",
      149.99,
      3,
      "https://m.media-amazon.com/images/I/71z7svZWSFL.jpg"
    );
    await createProduct(
      "Yamaha Clavinova Piano",
      "The Yamaha digital piano delivers an exceptional sound experience with its CFX and Bösendorfer Imperial Concert Grand voices, complemented by fortepiano voices and advanced Real Grand Expression 2 (RGE2) technology. It features Virtual Resonance Modeling (VRM) and binaural sampling for a rich, immersive sound, supported by powerful amplifiers (45 W + 35 W) and dual speakers (16 cm with diffuser + 5 cm). The GrandTouch-STM keyboard, with synthetic ebony and ivory key tops and an adjustable touch mechanism, provides a premium playing experience with five settings for personalized response. Additional features include headphones for silent practice, 38 extra voices, a 16-track recorder with USB flash drive support, and a metronome with a background drummer to accommodate any musical style and time signature.",
      5999.99,
      3,
      "https://europe.yamaha.com/en/files/CVP-909GP_a_0001_a37e118b8f5eaff304ddbda0af3ac7e2.jpg?impolicy=resize&imwid=396&imhei=396"
    );
    await createProduct(
      "Kawai Grand Piano",
      "The Boston piano boasts a duplex scale inspired by the renowned Steinway & Sons design, enhancing its harmonic richness and setting it apart from other instruments in its price range. With lower string tension, the Boston allows for a larger, tapered soundboard that produces longer sustain and a more resonant tone, contributing to the piano's longevity. Its innovative wide tail design provides a larger soundboard area compared to other pianos of the same length, allowing a 5 in 10in. Boston grand to deliver the power and richness of a typical 6 in 2 in grand. Each soundboard is crafted from Sitka spruce, recognized for its exceptional resonance, and is precisely tapered to promote freer vibration. Combined with unique technologies patented by Steinway & Sons, the Boston piano achieves a powerful, sustained tone that enhances the playing experience.",
      13999.99,
      3,
      "https://cdn11.bigcommerce.com/s-rjo23zgaad/images/stencil/original/products/207/451/Kawai-SK-EX__05857.1620353968.jpg?c=1"
    );
    await createProduct(
      "Starfavor Digital Piano",
      "The Starfavor 88-key heavy hammer action keyboard provides an acoustic piano-like touch, making it an ideal choice for beginners aiming to master finger techniques and elevate their musical skills. Enhanced with powerful dual 30W speakers and exclusive sound sampling, it delivers true-to-life sound quality that is rich and dynamic, perfect for practicing at home or performing on stage. With features such as 128 polyphony, 200 rhythms, and 238 timbres, along with additional functions like Chord, Metronome, and Record, users can customize their performance to perfection. The SP-20 also offers versatile connectivity options, including Bluetooth, USB, and MIDI, allowing seamless integration with music software in any setting. Its captivating design combines retro aesthetics with an avant-garde flair, making it not only a functional instrument but also a stylish addition to any room, inspiring a passion for piano playing, especially among beginners.",
      459.99,
      3,
      "https://m.media-amazon.com/images/I/71FobkNjTZL.jpg"
    );
    await createProduct(
      "Yamaha Arius Piano",
      "The CFX Premium Grand Piano Voice captures the power and tone of Yamaha's flagship CFX concert grand piano, offering an authentic playing experience. It features Graded Hammer 3 (GH3) action with synthetic ivory key tops, providing a tactile surface that absorbs moisture and prevents slipping. With Virtual Resonance Modeling (VRM), the instrument delivers vivid and richly varied expression, reflecting the complexities of concert grand sound. The full dot LCD display enables smooth navigation through its features, while the included padded bench, music stand, power supply, and sheet music book enhance convenience. With a maximum polyphony of 128 and half-damper pedal control, players can achieve greater nuance and realism, similar to an acoustic grand piano. The MIDI recording function allows for the recording of up to 16 tracks for simultaneous playback, and the innovative Stereophonic Optimizer offers a unique headphone experience, making this instrument a versatile choice for both practice and performance.",
      459.99,
      3,
      "https://www.yamaha.com/yamahavgn/PIM/Images/YDP-145B_a_0001_a91446934e2022e1d4b89d1b76fe8697.jpg"
    );

    await createProduct(
      "Yamaha DGX Digital Piano",
      "The Yamaha DGX-670 digital piano kit is the perfect all-in-one solution for pianists seeking to elevate their skills. Available at Guitar Center, this model features Yamaha's acclaimed Graded Hammer Standard action with 88 weighted keys, delivering an authentic grand piano experience. With an onboard lesson function, beginners can learn proper fingering and technique, while built-in accompaniment styles add a fun element to practice sessions. Intermediate and advanced players will enjoy the extensive selection of realistic instrument voices, along with audio recording capabilities that allow for easy capture of song ideas on the go.",
      1299.99,
      3,
      "https://www.yamaha.com/yamahavgn/PIM/Images/DGX-670B-f-0001_deb7a4ab696380dc3e66f6422d907bba.jpg"
    );
  } catch (error) {
    console.error("ERROR CONNECTING TO DATABASE: ", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

init();
