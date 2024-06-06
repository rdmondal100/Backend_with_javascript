import express from 'express'

const app = express()
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send("Server is Ready")
})

//get the joks
app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            "id": 1,
            "title": "Atom Trust Issues",
            "joke": "Why don’t scientists trust atoms? Because they make up everything!"
        },
        {
            "id": 2,
            "title": "Scarecrow's Achievement",
            "joke": "Why did the scarecrow win an award? Because he was outstanding in his field!"
        },
        {
            "id": 3,
            "title": "Skeletons' Fight Club",
            "joke": "Why don’t skeletons fight each other? They don’t have the guts."
        },
        {
            "id": 4,
            "title": "Impasta Alert!",
            "joke": "What do you call fake spaghetti? An impasta!"
        },
        {
            "id": 5,
            "title": "Sad Math Book",
            "joke": "Why did the math book look sad? Because it had too many problems."
        },
        {
            "id": 6,
            "title": "Nature vs. Programmers",
            "joke": "Why don’t programmers like nature? It has too many bugs."
        },
        {
            "id": 7,
            "title": "Penguin's Construction",
            "joke": "How does a penguin build its house? Igloos it together!"
        },
        {
            "id": 8,
            "title": "Gym Relationship",
            "joke": "Why don’t some couples go to the gym? Because some relationships don’t work out."
        },
        {
            "id": 9,
            "title": "Long Math Lecture",
            "joke": "Why was the math lecture so long? The professor kept going off on a tangent."
        },
        {
            "id": 10,
            "title": "Tired Bicycle",
            "joke": "Why did the bicycle fall over? Because it was two-tired!"
        },
        {
            "id": 11,
            "title": "Cheesy Ownership",
            "joke": "What do you call cheese that isn't yours? Nacho cheese."
        },
        {
            "id": 12,
            "title": "Elsa and Balloons",
            "joke": "Why can't you give Elsa a balloon? Because she will let it go."
        },
        {
            "id": 13,
            "title": "Snowman's Predicament",
            "joke": "What do you get if you cross a snowman and a vampire? Frostbite."
        },
        {
            "id": 14,
            "title": "Prepared Golfer",
            "joke": "Why did the golfer bring two pairs of pants? In case he got a hole in one."
        },
        {
            "id": 15,
            "title": "Alligator's Attire",
            "joke": "What do you call an alligator in a vest? An investigator."
        },
        {
            "id": 16,
            "title": "Late Broom",
            "joke": "Why was the broom late? It swept in."
        },
        {
            "id": 17,
            "title": "Cow Hooves",
            "joke": "Why do cows have hooves instead of feet? Because they lactose."
        },
        {
            "id": 18,
            "title": "Ocean Conversation",
            "joke": "What did one ocean say to the other ocean? Nothing, they just waved."
        },
        {
            "id": 19,
            "title": "Blushing Tomato",
            "joke": "Why did the tomato turn red? Because it saw the salad dressing."
        },
        {
            "id": 20,
            "title": "Healthy Ants",
            "joke": "Why don't ants get sick? Because they have tiny ant-bodies."
        }
    ]
    

    res.send(jokes)

})

app.listen(port, () => {
    console.log(`http://localhost:4000`)
})