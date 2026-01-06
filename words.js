// Word lists organized by category
const WORD_LISTS = {
    movies: [
        "Titanic", "Avatar", "Star Wars", "Jurassic Park", "The Matrix", "Frozen", 
        "Lion King", "Finding Nemo", "Toy Story", "Shrek", "Harry Potter", "Lord of the Rings",
        "Spider-Man", "Batman", "Iron Man", "The Avengers", "Black Panther", "Inception",
        "Jaws", "E.T.", "Back to the Future", "Indiana Jones", "Pirates of the Caribbean",
        "Aladdin", "Beauty and the Beast", "The Little Mermaid", "Moana", "Tangled",
        "Up", "Wall-E", "Ratatouille", "Inside Out", "Coco", "Zootopia", "Big Hero 6",
        "The Incredibles", "Monsters Inc", "Cars", "Brave", "The Godfather", "Forrest Gump",
        "Pulp Fiction", "Gladiator", "Rocky", "Top Gun", "Mission Impossible", "Terminator",
        "Alien", "Predator", "King Kong", "Godzilla", "Transformers", "Ghostbusters"
    ],
    tv_shows: [
        "Friends", "Game of Thrones", "Breaking Bad", "The Office", "Stranger Things",
        "The Simpsons", "SpongeBob", "Pokemon", "Dragon Ball", "Naruto", "The Walking Dead",
        "Big Bang Theory", "How I Met Your Mother", "Modern Family", "Brooklyn Nine-Nine",
        "Parks and Recreation", "The Crown", "The Mandalorian", "Squid Game", "Sherlock",
        "Doctor Who", "The Flash", "Arrow", "Supernatural", "Lost", "Heroes", "Prison Break",
        "Dexter", "House", "Grey's Anatomy", "ER", "Scrubs", "The Good Place", "Community",
        "Rick and Morty", "Family Guy", "South Park", "Adventure Time", "Avatar", "Teen Titans",
        "Scooby-Doo", "Tom and Jerry", "Looney Tunes", "Sesame Street", "Power Rangers",
        "Survivor", "American Idol", "The Voice", "MasterChef", "Dancing with the Stars"
    ],
    songs: [
        "Happy Birthday", "Jingle Bells", "Twinkle Twinkle", "Baby Shark", "Let It Go",
        "Bohemian Rhapsody", "Imagine", "Yesterday", "Hey Jude", "Let It Be", "Sweet Child O Mine",
        "Smells Like Teen Spirit", "Billie Jean", "Thriller", "Beat It", "Rolling in the Deep",
        "Someone Like You", "Hello", "Shape of You", "Blinding Lights", "Old Town Road",
        "Bad Guy", "Despacito", "Gangnam Style", "Uptown Funk", "Happy", "Can't Stop the Feeling",
        "All of Me", "Thinking Out Loud", "Perfect", "Señorita", "Rain on Me", "Dynamite",
        "Butter", "Levitating", "Watermelon Sugar", "Circles", "Rockstar", "God's Plan",
        "In My Feelings", "This Is America", "Bad Romance", "Poker Face", "Firework",
        "Roar", "Dark Horse", "Shake It Off", "Blank Space", "We Are Never Getting Back Together"
    ],
    animals: [
        "Top Dog", "Raining Cats and Dogs", "Elephant in the Room", "Lion's Mane", "Tiger Stripes", 
        "Bear Hug", "Giraffe Neck", "Zebra Crossing", "Monkey Business", "Gorilla Warfare",
        "Panda Eyes", "Koala Hug", "Kangaroo Pouch", "Rabbit Hole", "Squirrel Cheeks", 
        "Fox in Socks", "Wolf in Sheep's Clothing", "Deer in Headlights", "Moose Antlers",
        "Horse Around", "Cash Cow", "Piggy Bank", "Counting Sheep", "Scapegoat", 
        "Chicken Out", "Sitting Duck", "Wild Goose Chase", "Cold Turkey", "Proud as a Peacock",
        "Parrot Talk", "Eagle Eye", "Night Owl", "Penguin Waddle", "Flamingo on One Leg",
        "Swan Song", "Dolphin Flip", "Whale of a Time", "Shark Attack", "Octopus Arms",
        "Jellyfish Sting", "Crab Walk", "Lobster Claws", "Starfish Arms", "Seahorse Tail",
        "Turtle Shell", "Crocodile Tears", "See You Later Alligator", "Snake Eyes", 
        "Lizard Tail", "Leap Frog", "Toad Stool", "Butterfly Effect", "Busy as a Bee",
        "Ladybug Spots", "Spider Web", "Ants in Your Pants", "Grasshopper Jump", 
        "Dragonfly Wings", "Hungry Caterpillar", "Snail Mail", "Early Bird Gets the Worm",
        "Cat and Mouse", "Smell a Rat", "Hamster Wheel", "Guinea Pig Test", "Hedgehog Spikes",
        "Raccoon Eyes", "Skunk Stripe", "Busy Beaver", "Otter Space", "Seal of Approval",
        "Walrus Mustache", "Polar Bear Plunge"
    ],
    objects: [
        "Phone Home", "Computer Mouse", "Laptop on Lap", "Tablet Screen", "Couch Potato Television", 
        "Radio Star", "Smile for the Camera", "Wrist Watch", "Alarm Clock", "Lava Lamp",
        "Musical Chairs", "Under the Table", "Couch Surfing", "Make Your Bed", "Pillow Fight", 
        "Security Blanket", "Umbrella in the Rain", "Book Worm", "Pen Pal", "Pencil Sketch",
        "Eraser Marks", "Ruler Measurement", "Running with Scissors", "Stapler Jam", "Paper Airplane",
        "Pushing the Envelope", "Backpack Full", "Pack Your Suitcase", "Wallet Chain", 
        "Purse Strings", "Key to Success", "Lock and Key", "Knock on the Door", "Window Shopping",
        "Mirror Mirror on the Wall", "Toothbrush Mustache", "Bar of Soap", "Throw in the Towel",
        "Shampoo Mohawk", "Comb Over", "Brush Your Teeth", "Rose Colored Glasses", "Cool Sunglasses",
        "Hat Trick", "Thinking Cap", "Shirt Off Your Back", "Fancy Pants", "Shoe String Budget",
        "Knock Your Socks Off", "Straight Jacket", "Winter Scarf", "Boxing Gloves", "Ball and Chain",
        "Swing a Bat", "Tennis Racket", "Riding a Bicycle", "Skateboard Tricks", "Scooter Ride",
        "Car Keys", "Wheels on the Bus", "Train Tracks", "Flying Saucer", "Boat in a Bottle",
        "Rocket to the Moon", "Helicopter Propeller", "Hot Air Balloon", "Kite in the Wind",
        "Puzzle Pieces", "Roll the Dice", "House of Cards", "Chess Board", "Checkers Game",
        "Air Guitar", "Piano Keys", "Drum Roll", "Violin Bow", "Trumpet Player"
    ],
    food: [
        "Pizza", "Burger", "Hot Dog", "Sandwich", "Taco", "Burrito", "Sushi", "Pasta",
        "Spaghetti", "Lasagna", "Rice", "Noodles", "Soup", "Salad", "Bread", "Toast",
        "Pancake", "Waffle", "Cereal", "Oatmeal", "Bacon", "Eggs", "Cheese", "Butter",
        "Apple", "Banana", "Orange", "Grapes", "Strawberry", "Watermelon", "Pineapple",
        "Mango", "Peach", "Pear", "Cherry", "Blueberry", "Raspberry", "Lemon", "Lime",
        "Potato", "Carrot", "Broccoli", "Tomato", "Cucumber", "Lettuce", "Onion", "Pepper",
        "Corn", "Peas", "Beans", "Mushroom", "Cookie", "Cake", "Pie", "Donut", "Muffin",
        "Brownie", "Candy", "Chocolate", "Ice Cream", "Popsicle", "Popcorn", "Chips",
        "Coffee", "Tea", "Milk", "Juice", "Soda", "Water", "Smoothie", "Milkshake"
    ],
    places: [
        "Beach", "Mountain", "Forest", "Desert", "Ocean", "Lake", "River", "Waterfall",
        "Park", "Garden", "Zoo", "Museum", "Library", "School", "Hospital", "Airport",
        "Train Station", "Bus Stop", "Restaurant", "Cafe", "Store", "Mall", "Market",
        "Bank", "Post Office", "Police Station", "Fire Station", "Hotel", "Motel",
        "Church", "Temple", "Mosque", "Castle", "Palace", "Tower", "Bridge", "Tunnel",
        "Stadium", "Theater", "Cinema", "Concert Hall", "Gym", "Pool", "Playground",
        "Farm", "Ranch", "Barn", "Greenhouse", "Factory", "Office", "Warehouse", "Garage",
        "House", "Apartment", "Mansion", "Cottage", "Cabin", "Tent", "Igloo", "Treehouse",
        "Eiffel Tower", "Statue of Liberty", "Great Wall", "Pyramids", "Taj Mahal", "Colosseum"
    ],
    actions: [
        "Running", "Jumping", "Swimming", "Dancing", "Singing", "Sleeping", "Eating",
        "Drinking", "Walking", "Crawling", "Climbing", "Flying", "Diving", "Surfing",
        "Skiing", "Skating", "Biking", "Driving", "Reading", "Writing", "Drawing",
        "Painting", "Cooking", "Baking", "Cutting", "Stirring", "Pouring", "Washing",
        "Cleaning", "Sweeping", "Mopping", "Dusting", "Ironing", "Sewing", "Knitting",
        "Fishing", "Hunting", "Camping", "Hiking", "Jogging", "Stretching", "Exercising",
        "Lifting", "Pushing", "Pulling", "Throwing", "Catching", "Kicking", "Punching",
        "Clapping", "Waving", "Pointing", "Snapping", "Whistling", "Laughing", "Crying",
        "Yawning", "Sneezing", "Coughing", "Thinking", "Dreaming", "Talking", "Shouting",
        "Whispering", "Listening", "Watching", "Looking", "Smelling", "Tasting", "Touching"
    ]
};

// Get words from selected category
function getWordsByCategory(category) {
    if (category === 'all') {
        // Combine all categories
        const allWords = [];
        for (const cat in WORD_LISTS) {
            allWords.push(...WORD_LISTS[cat]);
        }
        return allWords;
    }
    return WORD_LISTS[category] || [];
}

// Get random word from category
function getRandomWord(category) {
    const words = getWordsByCategory(category);
    if (words.length === 0) return "Drawing";
    return words[Math.floor(Math.random() * words.length)];
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WORD_LISTS, getWordsByCategory, getRandomWord };
}
