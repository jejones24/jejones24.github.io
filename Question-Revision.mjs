import OpenAI from "openai";
const openai = new OpenAI({ apiKey: "sk-proj-OyrqHv9JEmbqh-BeZn5brtiS5" +
        "QsBy6t527Hp99rTTRjGKk3wuWTOMFYP7EQqTNBug6NO8rWR9gT3BlbkFJJO_xzVA-bDxEkSKrbSwWnI7HpkJEs6WLKflU-DhMSs9s3mwSbv" +
        "zXb2mthdPPjdL48GPO6qh5AA"});

const initialQuestion = "Create an in depth, semester long curriculum for a 10th grade pre-algebra class."

async function curriculum (prompt) {
    let initialQuestion = prompt;

    const goalDescription = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: "You are a helpful assistant."},
            {
                role: "user",
                content: `Based on ${initialQuestion}, what is the high-level goal of the prompt? `,
            },
        ],
    });

    const subTasks = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: "You are a helpful assistant."},
            {
                role: "user",
                content: `Based on ${initialQuestion}, in a bulleted list, what are subtasks that would be required in
            answering this question?`,
            },
        ],
    });

    let goalDescriptionString = goalDescription.choices[0].message["content"];
    let subTasksString = subTasks.choices[0].message["content"];

    let questionPrime = `${initialQuestion}. When fulfilling this query, consider ${goalDescriptionString}. Also 
    consider these subtasks that would streamline the lesson plan: ${subTasksString}. Please explain the output as well.`

    const firstOutput = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: "You are a helpful assistant."},
            {
                role: "user",
                content: questionPrime,
            },
        ],
    });

    console.log(firstOutput.choices[0].message["content"]);
    return firstOutput.choices[0].message["content"];

}
//
// const form = document.getElementById("form");
// const initialQuestion = form.elements['initialQuestion'];
// form.addEventListener("submit", () => {
//     const revisedQuestion = curriculum(initialQuestion)
//     const revisedQuestionString = Promise.resolve(revisedQuestion)
//     document.write(revisedQuestionString);
// });

const revisedQuestion = curriculum(initialQuestion)
const revisedQuestionString = Promise.resolve(revisedQuestion)
console.log(revisedQuestionString)
