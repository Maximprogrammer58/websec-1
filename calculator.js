const MAX_HISTORY = 5;

document.addEventListener('DOMContentLoaded', initCalculator);

let inputA, inputB, opSelect, actionButton, historyDisplay, currentDisplay, errorDisplay;
let log = [];

function initCalculator() {
    inputA = document.getElementById('argA');
    inputB = document.getElementById('argB');
    opSelect = document.getElementById('operator');
    actionButton = document.getElementById('runBtn');
    historyDisplay = document.getElementById('historyView');
    currentDisplay = document.getElementById('currentView');
    errorDisplay = document.getElementById('errorView');

    actionButton.addEventListener('click', performComputation);
    inputA.addEventListener('input', clearFieldError);
    inputB.addEventListener('input', clearFieldError);
}

function clearFieldError() {
    inputA.classList.remove('error-highlight');
    inputB.classList.remove('error-highlight');
    errorDisplay.textContent = '';
}

function markError(fieldIndex, message) {
    errorDisplay.textContent = message;
    if (fieldIndex === 1) {
        inputA.classList.add('error-highlight');
    } else if (fieldIndex === 2) {
        inputB.classList.add('error-highlight');
    }
}

function addToHistory(entry) {
    log.unshift(entry);
    if (log.length > MAX_HISTORY) {
        log.pop();
    }
    historyDisplay.textContent = log.join('\n');
}

function formatResult(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    if (Math.abs(num) < 1e-6) {
        return num.toExponential(6).replace(/\.?0+e/, 'e');
    }

    let fixed = num.toFixed(6);
    fixed = fixed.replace(/\.?0+$/, '');
    return fixed;
}

function performComputation() {
    clearFieldError();

    const rawA = inputA.value.trim();
    const rawB = inputB.value.trim();

    if (rawA === '') {
        markError(1, 'Заполните первое число');
        return;
    }
    if (rawB === '') {
        markError(2, 'Заполните второе число');
        return;
    }

    const valA = parseFloat(rawA);
    const valB = parseFloat(rawB);

    if (isNaN(valA)) {
        markError(1, 'Первое значение не является числом');
        return;
    }
    if (isNaN(valB)) {
        markError(2, 'Второе значение не является числом');
        return;
    }

    const op = opSelect.value;

    if (op === '/' && valB === 0) {
        markError(2, 'Делить на ноль нельзя');
        return;
    }

    const previousResult = currentDisplay.textContent.trim();
    if (previousResult) {
        addToHistory(previousResult);
    }

    let result;
    switch (op) {
        case '+':
            result = valA + valB;
            break;
        case '-':
            result = valA - valB;
            break;
        case '*':
            result = valA * valB;
            break;
        case '/':
            result = valA / valB;
            break;
    }

    const formatted = formatResult(result);
    const line = `${valA} ${op} ${valB} = ${formatted}`;
    currentDisplay.textContent = line;
}