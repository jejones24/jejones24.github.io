export function createNewInterface(GPTDict) {
    let element = document.getElementById("subInterfaces");
    const keyArray =  Array.from(Object.keys(GPTDict));

    for (let i=0; i<keyArray.length; i++) {
        let singleWeek = GPTDict[`Week ${i + 1}`];

        // creates panel
        let newPanel = document.createElement("div");
        newPanel.setAttribute("id", `weekPanel${i + 1}`);
        newPanel.setAttribute("className", "panel");
        newPanel.setAttribute("hidden", "true");  // might have error
        element.appendChild(newPanel);

        // setting insides of new panel

        // panel title
        let newTitlePara = document.createElement("h1");
        newTitlePara.innerText = `${singleWeek["Title"]}`;
        newTitlePara.style.color = "#00006c";
        newTitlePara.style.textAlign = "center";
        newTitlePara.style.fontWeight = "bold";
        newPanel.appendChild(newTitlePara);

        // panel header
        let newH = document.createElement("p");
        newH.innerText = `${keyArray[i]}`;
        newH.style.color = "#00006c";
        newH.style.textAlign = "center";
        newH.style.fontWeight = "bold";
        newPanel.appendChild(newH);

        // panel topics
        let newTopicPara = document.createElement("p");
        newTopicPara.innerText = "Topics: ";
        newTopicPara.style.fontWeight = "bold";
        newPanel.appendChild(newTopicPara);
        let newTopicList = document.createElement("ul");
        newPanel.appendChild(newTopicList);
        for (let j=0; j<singleWeek["Topics"].length; j++) {
            let newTopicElem = document.createElement("li");
            newTopicElem.innerText = `${singleWeek["Topics"][j]}`;
            newTopicList.appendChild(newTopicElem);
        }

        // panel assignments
        if (singleWeek["Assignments"] !== undefined) {
            let newAssignmentPara = document.createElement("p");
            newAssignmentPara.innerText = "Assignments: ";
            newAssignmentPara.style.fontWeight = "bold";
            newPanel.appendChild(newAssignmentPara);
            let newAssignmentList = document.createElement("ul");
            newPanel.appendChild(newAssignmentList);
            for (let j=0; j<singleWeek["Assignments"].length; j++) {
                let newAssignmentElem = document.createElement("li");
                newAssignmentElem.innerText = `${singleWeek["Assignments"][j]}`;
                newAssignmentList.appendChild(newAssignmentElem);
            }
        }

        // panel assessments
        if (singleWeek["Assessments"] !== undefined) {
            let newAssessmentPara = document.createElement("p");
            newAssessmentPara.innerText = "Assessments: ";
            newAssessmentPara.style.fontWeight = "bold";
            newPanel.appendChild(newAssessmentPara);
            let newAssessmentList = document.createElement("ul");
            newPanel.appendChild(newAssessmentList);
            for (let j=0; j<singleWeek["Assessments"].length; j++) {
                let newAssessmentElem = document.createElement("li");
                newAssessmentElem.innerText = `${singleWeek["Assessments"][j]}`;
                newAssessmentList.appendChild(newAssessmentElem);
            }
        }

    }

}

export function getWeekPanelID(i) {
    return `weekPanel${i+1}`
}

