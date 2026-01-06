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
        "Dog", "Cat", "Elephant", "Lion", "Tiger", "Bear", "Giraffe", "Zebra", "Monkey",
        "Gorilla", "Panda", "Koala", "Kangaroo", "Rabbit", "Squirrel", "Fox", "Wolf",
        "Deer", "Moose", "Horse", "Cow", "Pig", "Sheep", "Goat", "Chicken", "Duck",
        "Goose", "Turkey", "Peacock", "Parrot", "Eagle", "Owl", "Penguin", "Flamingo",
        "Swan", "Dolphin", "Whale", "Shark", "Octopus", "Jellyfish", "Crab", "Lobster",
        "Starfish", "Seahorse", "Turtle", "Crocodile", "Alligator", "Snake", "Lizard",
        "Frog", "Toad", "Butterfly", "Bee", "Ladybug", "Spider", "Ant", "Grasshopper",
        "Dragonfly", "Caterpillar", "Snail", "Worm", "Mouse", "Rat", "Hamster", "Guinea Pig",
        "Hedgehog", "Raccoon", "Skunk", "Beaver", "Otter", "Seal", "Walrus", "Polar Bear"
    ],
    objects: [
        "Phone", "Computer", "Laptop", "Tablet", "Television", "Radio", "Camera", "Watch",
        "Clock", "Lamp", "Chair", "Table", "Sofa", "Bed", "Pillow", "Blanket", "Umbrella",
        "Book", "Pen", "Pencil", "Eraser", "Ruler", "Scissors", "Stapler", "Paper", "Envelope",
        "Backpack", "Suitcase", "Wallet", "Purse", "Key", "Lock", "Door", "Window", "Mirror",
        "Toothbrush", "Soap", "Towel", "Shampoo", "Comb", "Brush", "Glasses", "Sunglasses",
        "Hat", "Cap", "Shirt", "Pants", "Shoes", "Socks", "Jacket", "Scarf", "Gloves",
        "Ball", "Bat", "Racket", "Bicycle", "Skateboard", "Scooter", "Car", "Bus", "Train",
        "Airplane", "Boat", "Rocket", "Helicopter", "Balloon", "Kite", "Puzzle", "Dice",
        "Cards", "Chess", "Checkers", "Guitar", "Piano", "Drum", "Violin", "Trumpet"
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
