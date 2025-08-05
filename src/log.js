export async function Log(stack, level, pkg, message, token) {
  const logData = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(logData)
    });
    if (!response.ok) {
      console.error('Log submission failed', response.status);
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending log', error);
  }
}
