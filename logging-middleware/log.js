// logging-middleware/log.js

export async function Log(stack, level, pkg, message, token) {
  // stack: "frontend"
  // level: "info", "warn", "error", etc.
  // pkg: "component", "state", "api", etc.
  // message: custom log message
  // token: the access_token you got from auth

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
        'Authorization': Bearer ${token}
      },
      body: JSON.stringify(logData)
    });
    if (!response.ok) {
      // Optionally handle log submission error
    }
    return response.json();
  } catch (error) {
    // Optionally handle network error
  }
}
