import OpenAI from "openai";
const openai = new OpenAI({ apiKey: "sk-proj-OyrqHv9JEmbqh-BeZn5brtiS5" +
        "QsBy6t527Hp99rTTRjGKk3wuWTOMFYP7EQqTNBug6NO8rWR9gT3BlbkFJJO_xzVA-bDxEkSKrbSwWnI7HpkJEs6WLKflU-DhMSs9s3mwSbv" +
        "zXb2mthdPPjdL48GPO6qh5AA"});

// const initialQuestion = "Create an in depth, semester long curriculum for a 10th grade pre-algebra class."

async function curriculum (prompt) {
    let questionPrime = `[${prompt}]. If the bracketed query is irrelevant to the creation of an educational 
    curriculum, politely say that you can't answer. When fulfilling this query, consider the high level goal of the 
    prompt. Make the output a bulleted and explain the reasoning behind the answer you give.`

    const output = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: "You are a helpful assistant."},
            {
                role: "user",
                content: questionPrime,
            },
        ],
    });

    return output.choices[0].message["content"];
}

const form = document.getElementById("form");
const initialQuestion = form.elements['initialQuestion'];
form.addEventListener("submit", () => {
    const revisedQuestion = curriculum(initialQuestion)
    const revisedQuestionString = Promise.resolve(revisedQuestion)
    document.write(revisedQuestionString);
});

export default curriculum()
