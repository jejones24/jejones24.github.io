export default function createStudentList (studentDict, activityDict, gradeDict) {
    let analysisSet = {}
    let studentKeyArray = Object.keys(studentDict);
    studentKeyArray.sort()
    console.log(studentKeyArray.length === 0)
    document.getElementById('studentSubscreen').hidden = studentKeyArray.length === 0;

    let newPara;
    let newDiv;
    let dropColor;
    let newLeftDiv;
    let newRightDiv;
    for (let i=0; i<studentKeyArray.length; i++) {
        let x = studentKeyArray[i];
        if (i % 2 === 0) {
            newPara = document.getElementById('studentA').cloneNode();
            newDiv = document.getElementById('studentADiv').cloneNode();
            dropColor = 'white'
        } else {
            newPara = document.getElementById('studentB').cloneNode();
            newDiv = document.getElementById('studentBDiv').cloneNode();
            dropColor = 'lightgray'
        }

        let assignmentKeys = Object.keys(activityDict);
        let student = studentDict[x]['studentID'];
        newLeftDiv = document.getElementById('studentDivLeft').cloneNode();
        newRightDiv = document.getElementById('studentDivRight').cloneNode();
        const dropdown =  document.createElement('button');
        dropdown.textContent = 'V';
        dropdown.style.border = '0px';
        dropdown.style.backgroundColor = dropColor;
        dropdown.style.color = '#00006c';
        dropdown.style.fontWeight = 'bold';
        dropdown.style.marginTop = '7px';
        dropdown.style.float = 'right';
        dropdown.className = 'studentDropdown';
        dropdown.addEventListener('click', () => switchStudentView(studentDict[x]['studentID']));
        newPara.appendChild(dropdown);
        let z = getTotalGrade(assignmentKeys, activityDict, gradeDict[student])
        newPara.textContent = `${studentDict[x]['lastName']}, ${studentDict[x]['firstName']}
                | ${studentDict[x]['studentID']} | ${studentDict[x]['email']} | ${z}`;
        newPara.hidden = false;

        document.getElementById("studentSubscreen").appendChild(newPara);
        newPara.appendChild(dropdown);

        newDiv.setAttribute('id', `studentPanel${studentDict[x]['studentID']}`);
        newDiv.appendChild(newLeftDiv);
        newDiv.appendChild(newRightDiv);


        let assignmentList = document.createElement('ul');
        newLeftDiv.appendChild(assignmentList);
        for (let i=0; i<assignmentKeys.length; i++) {
            let newAssignment = document.createElement("li");
            let newLink = document.createElement("a");
            newLink.href = `${activityDict[i]['activityPath']}`
            newLink.innerText = `${activityDict[i]['activityName']}`;
            newAssignment.appendChild(newLink)
            assignmentList.appendChild(newAssignment);
        }
        newLeftDiv.appendChild(assignmentList);



        let gradeList = document.createElement('ul');
        gradeList.style.listStyleType = 'none';
        newRightDiv.style.display = 'inline-block';
        newRightDiv.appendChild(gradeList);
        let setString = '';
        for (let i=0; i<assignmentKeys.length; i++) {
            let gradePercent;
            if (gradeDict[student][i] === '-') gradePercent = '--.--';
            else gradePercent = ((gradeDict[student][i] / activityDict[i]['points']) * 100).toFixed(2);
            let newGrade = document.createElement("li");
            newGrade.innerText = `${gradeDict[student][i]}/${activityDict[i]['points']} | ${gradePercent}% | ${getLetterGrade(gradePercent)}`;
            setString += `${activityDict[i]['activityName']}: ${gradePercent}. `
            gradeList.appendChild(newGrade);
        }
        newRightDiv.appendChild(gradeList);

        analysisSet[student] = {'statement': '', 'response': ''}
        analysisSet[student]['statement'] = `**${studentDict[x]['firstName']} ${studentDict[x]['lastName']}** Overall Course Grade: ${z}. Individual assignment scores: ${setString}.`
        console.log(analysisSet[student]['statement'])

        newDiv.hidden = true
        newDiv.style.textAlign = 'left'
        document.getElementById("studentSubscreen").appendChild(newPara);
        document.getElementById("studentSubscreen").appendChild(newDiv);
    }

    function switchStudentView(studentID) {
        document.getElementById(`studentPanel${studentID}`).hidden = document.getElementById(`studentPanel${studentID}`).hidden !== true;
    }

    function getTotalGrade(assignmentKeys, activityDict, studentScores) {
        // every student score / every assignment grade value
        let totalScore = 0;
        let totalPoints = 0;
        for (let i= 0; i<assignmentKeys.length; i++) {
            let x = assignmentKeys[i];
            if (studentScores[x] !== '-') {
                totalScore += parseInt(studentScores[x]);
                totalPoints += parseInt(activityDict[i]['points']);
            }
        }
        let percentage = ((totalScore / totalPoints) * 100).toFixed(2)
        return `${percentage}% | ${getLetterGrade(percentage)}`
    }

    function getLetterGrade(num) {
        if (num === '--.--') return '-'
        else if (num >= 93) return 'A'
        else if (num >= 90 && num < 93) return 'A-'
        else if (num >= 87 && num < 90) return 'B+'
        else if (num >= 83 && num < 87) return 'B'
        else if (num >= 80 && num < 83) return 'B-'
        else if (num >= 77 && num < 80) return 'C+'
        else if (num >= 73 && num < 77) return 'C'
        else if (num >= 70 && num < 73) return 'C-'
        else if (num >= 67 && num < 70) return 'D+'
        else if (num >= 63 && num < 67) return 'D'
        else if (num >= 60 && num < 63) return 'D-'
        else return 'F'

    }

    function beginAIPlus() {

    }

    return analysisSet;
}