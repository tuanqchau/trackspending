
document.getElementById('spendingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    debugger

    
    const description = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;


    const data = {
        item: description,
        price: price
    };

    fetch('https://tracking-spending.netlify.app/.netlify/functions/submitSpending', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()) // Get the JSON response from the serverless function
    .then(data => {
        alert(data.message); // Show the server response in an alert
        document.getElementById('spendingForm').reset(); // Reset the form
    })
    .catch(error => {
        console.error('Error:', error);
    });


});