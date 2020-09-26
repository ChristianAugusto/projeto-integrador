export default function() {
    return {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'hello-world'
        })
    };
}
