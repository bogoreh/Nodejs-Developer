async function calculate(operation) {
    const num1 = document.getElementById('num1').value;
    const num2 = document.getElementById('num2').value;

    if (!num1 || !num2) {
        alert('Please enter both numbers!');
        return;
    }

    const resultContainer = document.getElementById('result-container');
    const resultContent = document.getElementById('result-content');

    try {
        const response = await fetch(`/api/${operation}?num1=${num1}&num2=${num2}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Calculation failed');
        }

        resultContent.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">${data.expression}</h2>
                <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px;">
                    <pre style="margin: 0; color: white;">${JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        `;
        
        resultContainer.classList.remove('hidden');
    } catch (error) {
        alert(error.message);
    }
}