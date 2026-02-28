// Helper function to validate numbers
const validateNumbers = (num1, num2) => {
    if (isNaN(num1) || isNaN(num2)) {
        return false;
    }
    return true;
};

// Addition
exports.add = (req, res) => {
    const { num1, num2 } = req.query;
    
    if (!validateNumbers(num1, num2)) {
        return res.status(400).json({
            error: 'Invalid input',
            message: 'Please provide valid numbers'
        });
    }
    
    const result = parseFloat(num1) + parseFloat(num2);
    
    res.json({
        operation: 'addition',
        num1: parseFloat(num1),
        num2: parseFloat(num2),
        result: result,
        expression: `${num1} + ${num2} = ${result}`
    });
};

// Subtraction
exports.subtract = (req, res) => {
    const { num1, num2 } = req.query;
    
    if (!validateNumbers(num1, num2)) {
        return res.status(400).json({
            error: 'Invalid input',
            message: 'Please provide valid numbers'
        });
    }
    
    const result = parseFloat(num1) - parseFloat(num2);
    
    res.json({
        operation: 'subtraction',
        num1: parseFloat(num1),
        num2: parseFloat(num2),
        result: result,
        expression: `${num1} - ${num2} = ${result}`
    });
};

// Multiplication
exports.multiply = (req, res) => {
    const { num1, num2 } = req.query;
    
    if (!validateNumbers(num1, num2)) {
        return res.status(400).json({
            error: 'Invalid input',
            message: 'Please provide valid numbers'
        });
    }
    
    const result = parseFloat(num1) * parseFloat(num2);
    
    res.json({
        operation: 'multiplication',
        num1: parseFloat(num1),
        num2: parseFloat(num2),
        result: result,
        expression: `${num1} × ${num2} = ${result}`
    });
};

// Division
exports.divide = (req, res) => {
    const { num1, num2 } = req.query;
    
    if (!validateNumbers(num1, num2)) {
        return res.status(400).json({
            error: 'Invalid input',
            message: 'Please provide valid numbers'
        });
    }
    
    if (parseFloat(num2) === 0) {
        return res.status(400).json({
            error: 'Division by zero',
            message: 'Cannot divide by zero'
        });
    }
    
    const result = parseFloat(num1) / parseFloat(num2);
    
    res.json({
        operation: 'division',
        num1: parseFloat(num1),
        num2: parseFloat(num2),
        result: result,
        expression: `${num1} ÷ ${num2} = ${result}`
    });
};